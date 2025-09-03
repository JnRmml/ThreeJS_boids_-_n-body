# 🌀 Boids & N-Body Simulation mit Three.js

Dieses Projekt visualisiert zwei Bewegungsmodelle in 2D mit **Three.js**:

* **Boids-Verhalten**: Schwarmverhalten basierend auf Alignment, Cohesion und Separation
* **N-Body Gravitation**: Physikalisch inspirierte Gravitation mit Abstoßung zur Kollisionsvermeidung

---

## Eingesetzt

* [Three.js](https://threejs.org/) – 2D/3D WebGL Rendering Framework
* [dat.GUI](https://github.com/dataarts/dat.gui) – Live-Parameteranpassung
* Vanilla JavaScript (keine Frameworks)
* ursprüngliche Boids-Modell (1986) ist von Craig Reynolds

---

## 🎮 Steuerung

| Taste     | Aktion                        |
| --------- | ----------------------------- |
| **B**     | Boids-Modus aktivieren        |
| **N**     | N-Body-Gravitation aktivieren |
| **Q / A** | Alignment + / -               |
| **W / S** | Cohesion + / -                |
| **E / D** | Separation + / -              |
| **R / F** | Gravitation + / -             |

Alternativ können die Parameter direkt über die GUI verändert werden.


## 📂 Dateistruktur

```bash
.
├── index.html         # Einstiegspunkt
├── agent.js           # Agent-Klasse (Logik für Bewegung & Verhalten)
├── main.js            # Initialisierung & Animationsloop
```


## 🧠 Boids-Verhalten

* **Alignment**: Ausrichtung an der durchschnittlichen Richtung der Nachbarn
* **Cohesion**: Bewegung zum Massenzentrum der Nachbarn
* **Separation**: Abstoßung bei zu geringem Abstand


## 🌌 N-Body Gravitation

* Jede "Masse" zieht alle anderen gemäß dem Gravitationsgesetz an
* Zusätzlich gibt es eine **künstliche Separation**, die Kollisionen verhindert 

---

## 📦 Installation & Ausführung

Direkt die `index.html`  im Browser öffnen

   > Alles läuft lokal
   > Ansonsten: von https://threejs.org/ dei Dateien herunterladen und einbinden


## Ideen für Erweiterungen

*  Mausinteraktion (z. B. Klick zieht Agenten an)
*  Farbverläufe basierend auf Geschwindigkeit oder Kraft
*  in 3-dimensionalen Raum umsetzen
*  Soundintegration bei Kollisionen
*  Echt physikalische Gravitation mit Barnes-Hut-Optimierung
*  Live-Graphen für Kraftverläufe
*  Agenten löschen sich gegenseitig aus / verklumpen oder...
*  Schere-Stein-Papier zwischen den Agenten
