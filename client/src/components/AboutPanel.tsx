import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import type { AppInfo } from "../types";
import "./about-panel.css";

/**
 * About / Credits tab. Quiet, dezent, but acknowledges every project /
 * dataset / piece of reverse-engineering FlyAzoresACARS stands on. Each
 * line is a real reference — `OurAirports`, `BeatMyLanding`, `GEES`,
 * `vmsACARS`, `LandingToast` — these were studied in detail to get
 * the touchdown analyzer right.
 *
 * Renders the credit prominently but not loudly. Pilot opens
 * this tab when they want to know "what is this thing made of"; it
 * isn't shoved in their face on every other screen.
 */
interface Props {
  /** Open the in-app release-notes modal for the given version. App
   *  passes a setter that mounts `<ReleaseNotesModal version={...}>`. */
  onShowReleaseNotes: (version: string) => void;
}

export function AboutPanel({ onShowReleaseNotes }: Props) {
  const { t } = useTranslation();
  const [info, setInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const ai = await invoke<AppInfo>("app_info");
        if (!cancelled) setInfo(ai);
      } catch {
        // app_info should never fail; if it does, just leave the
        // hero strip blank rather than showing a confusing error.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="about-modern">
      <header className="about-modern__hero">
        <h2 className="about-modern__title">FlyAzoresACARS</h2>
        <p className="about-modern__tagline">{t("about.tagline")}</p>
        
        {info && (
          <div className="about-modern__version">
            <span>v{info.version}</span>
            {info.commit ? <> &bull; <code>{info.commit.slice(0, 7)}</code></> : null}
          </div>
        )}
        
        {info && <div className="about-modern__credit">{info.credit}</div>}
        
        {info && (
          <div className="about-modern__hero-actions">
            <button
              type="button"
              className="button-modern button-modern--primary"
              onClick={() => onShowReleaseNotes(info.version)}
            >
              {t("release_notes.about_button")}
            </button>
            <a
              className="button-modern"
              href="https://github.com/oAlvesOFF/FlyAcars/releases"
              target="_blank"
              rel="noreferrer"
            >
              {t("release_notes.about_all_releases")}
            </a>
          </div>
        )}
      </header>

      <div className="about-modern__grid">
        <div className="about-modern__card">
          <h3>{t("about.purpose_title")}</h3>
          <p className="about-modern__hint">{t("about.purpose_body")}</p>
        </div>

        <div className="about-modern__card" style={{ gridColumn: "1 / -1" }}>
          <h3>{t("about.acknowledgements_title")}</h3>
          <p className="about-modern__hint">{t("about.acknowledgements_intro")}</p>
          <ul className="about-modern__list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <li>
              <strong>OurAirports</strong>
              Public-domain runway dataset powering the centerline/threshold correlation.{" "}
              <a href="https://ourairports.com/data/" target="_blank" rel="noreferrer">ourairports.com/data</a>
            </li>
            <li>
              <strong>BeatMyLanding</strong>
              Reference for touchdown-window timings (500 ms / 1500 ms) and bounce-detection calibration via AGL edges.
            </li>
            <li>
              <strong>GEES</strong>
              Open-source landing-rate logger; confirmed our V/S sign convention and native sideslip via VEL_BODY_X/Z.{" "}
              <a href="https://github.com/scelts/gees" target="_blank" rel="noreferrer">github.com/scelts/gees</a>
            </li>
            <li>
              <strong>LandingToast</strong>
              Validated the live-VS-at-on-ground-edge approach (no PLANE TOUCHDOWN NORMAL VELOCITY needed).
            </li>
            <li>
              <strong>Tauri 2 + React + Rust</strong>
              App framework.
            </li>
            <li>
              <strong>Microsoft Flight Simulator SDK</strong>
              SimConnect client API.
            </li>
            <li>
              <strong>Laminar Research X-Plane SDK</strong>
              UDP RREF DataRef protocol documentation.
            </li>
          </ul>
        </div>

        <div className="about-modern__card">
          <h3>{t("about.thresholds_title")}</h3>
          <p className="about-modern__hint">{t("about.thresholds_intro")}</p>
          <ul className="about-modern__list">
            <li><strong>Boeing 737 FCOM</strong> Hard-Landing inspection trigger</li>
            <li><strong>Airbus A320 FCOM</strong> TD sink rate / inspection criteria</li>
            <li><strong>Lufthansa FOQA</strong> Public category bands</li>
          </ul>
        </div>
      </div>

      <footer className="about-modern__footer">
        <p>© {new Date().getFullYear()} FlyAzoresACARS Project &bull; MIT License</p>
        <p>{info?.credit}</p>
      </footer>
    </section>
  );
}
