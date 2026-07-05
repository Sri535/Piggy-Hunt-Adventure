# 🐷 Piggy Hunt Adventure
## Architecture Decision Record (ADR)

**Project:** Piggy Hunt Adventure

**Engine:** Three.js (JavaScript ES Modules)

**Architecture Version:** 1.0

**Status:** Active

---

# Vision

Piggy Hunt Adventure is designed as a reusable adventure game engine rather than a collection of world-specific scripts.

The primary goals are:

- Reusable systems
- Data-driven worlds
- Easy expansion
- High maintainability
- Stable architecture throughout development

---

# Core Principles

## 1. Worlds assemble systems

Worlds do not create geometry directly.

A world is responsible only for assembling environment systems.

Example

IslandWorld

↓

EnvironmentManager

↓

TerrainSystem

↓

WaterSystem

↓

VegetationSystem

↓

RockSystem

---

## 2. Systems own implementation

Every environment system owns its own:

- Geometry
- Materials
- Animations
- Cleanup

No implementation details should exist inside World classes.

---

## 3. Configuration Driven

Every world owns its own configuration.

configs/

ForestConfig.js

IslandConfig.js

SnowConfig.js

VolcanoConfig.js

SpaceConfig.js

The Environment Engine consumes these configurations.

---

## 4. No duplicated world logic

If a feature can be reused by another world, it belongs inside:

environment/

NOT inside:

worlds/

---

## 5. One Responsibility Per Class

Every class should have one clear purpose.

Example

TerrainSystem

Creates terrain only.

Never creates trees.

Never creates water.

Never creates piggies.

---

# Folder Structure

src/

core/

configs/

environment/

gameplay/

managers/

piggies/

player/

ui/

worlds/

This folder structure is frozen for Version 1.x.

---

# Environment Engine

EnvironmentManager coordinates reusable environment systems.

Current systems

TerrainSystem

Future systems

WaterSystem

VegetationSystem

RockSystem

DecorationSystem

WeatherSystem

AmbientLifeSystem

Every system follows the same lifecycle.

constructor(config)

create()

update(delta)

dispose()

---

# World Lifecycle

Game

↓

WorldManager

↓

World

↓

EnvironmentManager

↓

Environment Systems

---

# Configuration Philosophy

Configuration contains data.

Systems contain behavior.

Never mix the two.

Example

IslandConfig

contains

terrain size

water level

vegetation counts

rock counts

TerrainSystem

contains

terrain generation

height calculation

geometry

materials

---

# Dependency Rules

Allowed

Game

↓

WorldManager

↓

World

↓

EnvironmentManager

↓

Environment Systems

Not Allowed

UI

↓

Terrain

Environment

↓

Gameplay

Piggies

↓

UI

World

↓

Renderer internals

---

# File Size Guidelines

Target

200–400 lines

Soft limit

500 lines

If a file grows beyond the soft limit, extract a new system.

---

# Coding Standards

Class Layout

Constructor

Create

Update

Dispose

Use section headers consistently.

Avoid magic numbers.

Prefer configuration objects.

---

# Development Workflow

Every feature follows the same cycle.

1. Architecture
2. Implementation
3. Verification
4. Git Commit
5. Review

No large unverified changes.

---

# Git Commit Convention

feat:

New functionality

fix:

Bug fix

refactor:

Architecture or internal improvement

docs:

Documentation

style:

Formatting only

---

# Long-Term Roadmap

Milestone A

Engine Foundation ✅

Milestone B

Environment Engine

Milestone C

Island World

Milestone D

Forest Refactor

Milestone E

Snow World

Milestone F

Volcano World

Milestone G

Space World

Milestone H

Story Mode

Milestone I

Release Candidate

---

# ADR Log

## ADR-001

Date

2026

Decision

Introduce EnvironmentManager.

Reason

Remove environment ownership from World classes.

Status

Accepted.

---

## ADR-002

Date

2026

Decision

Environment systems use a common lifecycle.

constructor()

create()

update()

dispose()

Reason

Consistency and maintainability.

Status

Accepted.

---

## ADR-003

Date

2026

Decision

Worlds use configuration files.

Reason

Support multiple worlds without code duplication.

Status

Accepted.

---

# Design Philosophy

When in doubt, prefer:

Reuse over duplication

Configuration over hardcoding

Composition over inheritance

Small systems over large classes

Readable code over clever code

Stable APIs over frequent redesigns

Playable game over perfect architecture

End of Document.