# 🐷 Piggy Hunt Adventure - Stage 1 Foundation
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform: Mobile & Desktop](https://img.shields.io/badge/Platform-Mobile%20%7C%20Desktop-blue.svg)]()
[![Engine: Three.js](https://img.shields.io/badge/Engine-Three.js%20(r160)-lightgrey.svg)](https://threejs.org/)
[![Hosting: GitHub Pages](https://img.shields.io/badge/Hosting-GitHub%20Pages-green.svg)]()
## Overview

Piggy Hunt Adventure is a browser-based 3D treasure hunting game built with:

* HTML5
* CSS3
* Vanilla JavaScript
* Three.js
* WebGL
* Device Orientation API
* LocalStorage

Stage 1 establishes the core game engine and infrastructure that all future gameplay features will build upon.

---

# Stage 1 Goals

The objective of Stage 1 is to create a stable and scalable game foundation with:

* Three.js rendering engine
* HDR rendering pipeline
* Bloom post-processing
* Tone mapping
* Desktop controls
* Mobile gyroscope controls
* Save system
* Asset loading system
* Main menu
* Loading screen
* Responsive UI

---

# Current Features

## Graphics

* Three.js renderer
* ACES Filmic Tone Mapping
* Unreal Bloom
* Dynamic exposure control
* Directional sunlight
* Ambient lighting
* Fog support
* Responsive rendering

---

## Desktop Controls

| Action        | Control |
| ------------- | ------- |
| Move Forward  | W       |
| Move Backward | S       |
| Move Left     | A       |
| Move Right    | D       |
| Jump          | Space   |
| Sprint        | Shift   |
| Look Around   | Mouse   |
| Pause         | ESC     |

---

## Mobile Controls

| Action          | Control          |
| --------------- | ---------------- |
| Look Around     | Gyroscope        |
| Camera Rotation | Touch            |
| Movement        | Virtual Joystick |

---

## Save System

The SaveManager provides:

* Auto-save every 30 seconds
* LocalStorage persistence
* Player progression storage
* Settings storage
* World unlock tracking
* Achievement tracking
* Collection tracking
* Save export/import support

---

## Asset System

The AssetManager supports:

* Texture loading
* GLTF model loading
* Audio loading
* Loading progress tracking
* Asset caching
* Future asset expansion

---

# Project Structure

```text
Piggy-Hunt-Adventure/

index.html
style.css

src/

├── main.js
├── Game.js
├── Renderer.js
├── CameraController.js
├── InputManager.js
├── SaveManager.js
└── AssetManager.js

assets/

├── icons/
├── textures/
├── sounds/
└── models/

manifest.json
sw.js
README.md
```

---

# Engine Architecture

```text
main.js
    │
    ▼
Game.js
    │
    ├── Renderer.js
    ├── CameraController.js
    ├── InputManager.js
    ├── SaveManager.js
    └── AssetManager.js
```

---

# Running Locally

## Option 1 - Python

```bash
python -m http.server 8080
```

Open:

```text
http://localhost:8080
```

---

## Option 2 - VS Code

Install:

* Live Server Extension

Right-click:

```text
index.html
```

Select:

```text
Open with Live Server
```

---

# SaveManager Testing

Open browser console:

```javascript
GameInstance().save.addCoins(100);
GameInstance().save.save();
```

Verify:

```javascript
GameInstance().save.getPlayer();
```

Refresh browser and verify data persists.

---

# Known Stage 1 Limitations

Stage 1 intentionally does NOT include:

* Piggies
* Radar system
* Forest world
* Snow world
* Volcano world
* Space world
* Shop system
* Daily rewards
* Achievements UI
* Multiplayer

These features are planned for future stages.
---
Your game will be available at:

Play the production version instantly here: 
👉 **Play game https://sri535.github.io/Piggy-Hunt-Adventure/**

---

# Planned Stage 2

## Enchanted Forest World

Features:

* Procedural trees
* Animated grass
* Fireflies
* Dynamic fog
* Day/night cycle
* Environmental ambience

---

# Planned Stage 3

## Piggy Hunting Gameplay

Features:

* Common Piggy
* Golden Piggy
* Rainbow Piggy
* Ghost Piggy
* Dragon Piggy
* Capture system
* Radar system
* XP rewards
* Coin rewards

---

# Planned Stage 4

Additional Worlds:

* Tropical Island
* Snow Valley
* Volcano World
* Space Piggy Planet

---

# Planned Stage 5

Progression Systems:

* Shop
* Daily rewards
* Achievements
* Collection Book
* Unlockables

---

# Planned Stage 6

Visual Upgrades:

* GLTF characters
* HDRI lighting
* Water reflections
* GPU particles
* Advanced shaders

---

# Planned Stage 7

Online Features:

* Multiplayer
* Live leaderboard
* Piggy races
* Capture competitions

---

# Author

Sreenivasula Reddy Mukkamalla

Lead Performance Engineer
Performance Testing | Chaos Engineering | Automation | Web Game Development

---

# License

MIT License
## Visitor Stats

![Views](https://komarev.com/ghpvc/?username=Sri535&color=brightgreen)
![Visitor Badge](https://visitor-badge.laobi.icu/badge?page_id=Piggy-Hunt-Adventure)
