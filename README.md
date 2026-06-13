# Koya932 FamilyTreeOki Dashboard

This repository contains a working React / Vite dashboard starter for Koya and FamilyTreeOki.

## Purpose

Monitor US macro risk, Japan-US FX structure, Okinawa US military purchasing power, and FamilyTreeOki pricing / LTV decisions.

## Start

```powershell
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://127.0.0.1:5173/
```

## Build

```powershell
npm.cmd run build
```

## Data Discipline

- Do not invent numbers.
- Keep observed, estimated, mock, fallback, unknown, and blocked_or_failed separate.
- Put real integrations behind source adapters.
- Keep source_id and fetchedAt fields for external data.
- Flag TRICARE, medical advertising, qualification, childcare, and babysitting wording for human review.

## Source Adapters To Add

- FRED / BLS / FRB for US macro risk
- Yahoo Finance or equivalent for USD/JPY
- DFAS / DTMO / OHA / BAS / COLA for military purchasing power
- TRICARE and official Okinawa medical information
- FamilyTreeOki reservation, sales, review, and LTV data
