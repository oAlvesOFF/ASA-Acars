# ASA-ACARS

> Cliente ACARS moderno e de código aberto para [phpVMS 7](https://phpvms.net) — Tauri 2 + Rust + React.
> Feito com ❤️

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-blue.svg)](#installation)
[![phpVMS 7](https://img.shields.io/badge/phpVMS-7-orange.svg)](https://phpvms.net)

---

## O que é o ASA-ACARS?

Um cliente ACARS moderno e multiplataforma para o phpVMS 7. Regista telemetria de simuladores de voo, pontua aterragens com limites validados pela indústria, correlaciona o toque na pista com precisão de linha de centro (centerline) e envia PIREPs limpos para o teu servidor phpVMS.

**Atualmente suporta:**

- ✅ **MSFS 2020 / MSFS 2024** — via SimConnect FFI nativo (apenas Windows, sem necessidade de FSUIPC)
- ✅ **X-Plane 11 / X-Plane 12** — via UDP DataRefs nativos (multiplataforma, sem necessidade de plugins)

---

## Instalação

Transfere o pacote correspondente à tua plataforma a partir da [Última Versão (Latest Release)](https://github.com/oAlvesOFF/ASA-ACARS/releases/latest).

### Windows (10 / 11, x64)

1. Transfere e executa o ficheiro `ASA-ACARS_<version>_x64-setup.exe` (instalador NSIS).
2. Ignora o aviso do SmartScreen: "Mais informações" → "Executar assim mesmo" — ainda não temos assinatura de código (code-signed).
3. O ASA-ACARS inicia automaticamente após a instalação.
4. Faz login com a tua chave de API do phpVMS.

### macOS (Apple Silicon — M1 / M2 / M3 / M4)

1. Transfere o ficheiro `ASA-ACARS_<version>_aarch64.dmg`.
2. Abre o DMG → Arrasta o ícone do ASA-ACARS para a pasta Aplicações.
3. **No primeiro arranque:** O Gatekeeper irá bloquear a app por não ter passado pela Notarização da Apple. Tens dois caminhos:
   - **Via clique direito:** No Finder, clica com o botão direito no ASA-ACARS → "Abrir" → Confirma "Abrir" no diálogo. Depois disto, o macOS memoriza a permissão e inicia a app normalmente a partir daí.
   - **Via Terminal** (caso o clique direito não mostre a opção — acontece com configurações restritivas do Gatekeeper):
     ```bash
     xattr -dr com.apple.quarantine /Applications/ASA-ACARS.app
     ```
4. Faz login com a tua chave de API do phpVMS.

> **Nota:** Os Macs com Intel não são compilados oficialmente de momento. Se houver necessidade: abre um *Issue*, o build do Tauri pode ser facilmente expandido para incluir `x86_64-apple-darwin`.

### Atualizações Automáticas

A partir da v0.1.0+, as novas versões aparecem diretamente como um banner de atualização na app — sem necessidade de downloads manuais. O atualizador verifica os pacotes via assinatura Ed25519, sendo seguro mesmo sem assinatura de código/notarização.

---

## O que o ASA-ACARS consegue fazer?

### Telemetria em Tempo Real + Rastreio de Voo
- FSM de deteção de fase (16 fases: Boarding → Pushback → TaxiOut → Takeoff → Climb → Cruise → Descent → Approach → Final → Landing → TaxiIn → BlocksOn → Arrived → PIREP)
- Streaming de posição para o phpVMS com cadência adaptativa à fase de voo.
- Fila (Queue) offline para registos de posição caso a ligação à rede falhe.

### Análise de Toque (Nível Industrial)
- Amostragem a 50 Hz (equivalente ao GEES, superior ao padrão do MSFS).
- Captura de V/S a partir de SimVar travada (MSFS) ou Buffer-Min ±250 ms (Padrão GEES).
- G de pico (Peak-G) numa janela de 800 ms após o impacto (excluindo o ressalto dos amortecedores).
- Deteção de ressalto (Bounce) baseada em AGL (35→5 pés, alinhado com BeatMyLanding).
- Sideslip nativo via VEL_BODY_X/Z (`atan2`).
- Vento de frente/través (Headwind/Crosswind) a partir de componentes de vento relativos à célula da aeronave.
- Limites de pontuação baseados em FCOM da Boeing 737, Airbus A320, LH FOQA e padrões vmsACARS.

### Correlação de Pista
- Base de dados de pistas OurAirports.com incorporada (47.681 pistas, 4 MB).
- Lat/Lon de toque → Identificação exata da pista + distância da linha de centro + distância do threshold.

### Submissão de PIREP
- Bloco de notas completo (TIMES / TOUCHDOWN / RUNWAY / FUEL / DISTANCE / METAR).
- ~40 campos personalizados (Title-Case + snake_case para tabelas de classificação).
- Envio automático ao chegar (`Arrived`), com opção de cancelamento manual.
- Eliminação de licitação (Bid-Delete) via endpoint `/api/user/bids` correto.

### Funcionalidades de Conforto
- Auto-Start-Watcher: A gravação começa automaticamente quando a aeronave está no aeroporto de partida da licitação.
- Registo de atividade persistente com recuperação de falhas (reset por voo).
- Inspetor de simulador em tempo real no modo de depuração (MSFS SimVars/LVars + X-Plane DataRefs).
- Snapshots de METAR Dep/Arr automáticos na descolagem e final.

---

## Stack Tecnológica

- **Backend:** Rust (Tauri 2, SimConnect FFI nativo para MSFS, std::net para X-Plane UDP).
- **Frontend:** React 19 + TypeScript + Vite.
- **Persistência:** Keyring do SO para chaves de API, ficheiros JSON secundários para logs de atividade e estado do voo ativo.
- **Atualizador:** Plugin-Updater do Tauri com assinatura Ed25519, GitHub Releases como fonte.

---

## Ombro de Gigantes (Créditos)

- **OurAirports** — Base de dados de pistas em domínio público.
- **BeatMyLanding** — Calibração de janela de toque e padrão de deteção de ressalto.
- **GEES** — Logger de taxa de aterragem open-source; engenharia reversa para convenção de sinais de V/S e cálculo de sideslip nativo.
- **LandingToast** — Padrão de Live-VS-at-OnGround-Edge.
- **Tauri 2 + Rust + React** — Framework da aplicação.
- **MSFS SDK + X-Plane SDK** — Integração com simuladores.

---

### Reportar um Problema

Se algo correr mal, a informação mais valiosa no relatório de erro é:

1. O ficheiro `flight_logs/<pirep_id>.jsonl` do voo afetado (compactado em .zip).
2. O excerto relevante do `activity_log.json`.
3. Se for reproduzível: algumas linhas da saída de tracing com `RUST_LOG=info,ASA-ACARS=debug` via execução no terminal.

Por favor, submete os problemas em → [github.com/oAlvesOFF/ASA-ACARS/issues](https://github.com/oAlvesOFF/ASA-ACARS/issues)
