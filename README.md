# TongueCare · Tongue Demo

An interactive patient-facing UI prototype that demonstrates both **Basic** and **VIP** TongueCare experiences.

This course project focuses on interface design, page structure, and user flows. It presents a mobile app through a responsive website. No model training, medical dataset, or backend database is required.

## Preview

[Open the online demo](https://shekang-daily.yuanbaiiscool.chatgpt.site)

The hosted demo currently allows access only to the project owner. Classmates and instructors can run it locally using the instructions below. A public GitHub repository does not change the demo site's access permissions.

## Implemented screens

| Screen  | Features |
| ------- | -------- |
| Home | Daily check-in, weekly activity, latest entry, trends shortcut, Smart Visit Prep, and photo tips |
| Capture | Guided capture, automatic quality feedback, recapture, feelings, notes, weight, symptoms, medication, sleep, activity, meals, and simulated AI Doctor guidance |
| Journal | Entry history, clearly labelled weekly check-in completion, VIP 30-day completion, daily-factor integration, clinician goals, demo test-report upload and comparison, and Smart Visit Prep |
| Profile | Basic/VIP preview switch, hospital care-plan connection, reminders, privacy information, and help |

The interface uses a teal palette, rounded cards, and bottom navigation. Desktop browsers display a phone-shaped preview; smaller screens use the available width. All interface text and example entries are in English.

### Suggested demo flow

1. Select **Start today’s check-in** on Home.
2. Select **Try a demo capture**, or **Choose a photo** to pick a local image.
3. Choose how you feel and optionally add notes about sleep, meals, or your day.
4. Select **Get AI Doctor advice** and review the personalized demo guidance.
5. Save the guidance, open **Journal**, then select the new entry to view its details.
6. Open **Journal**, then switch between **Entries**, **Trends**, and **Visit prep**.
7. Open **Profile** to switch between the Basic and VIP UI previews or connect the simulated hospital care plan.

## Demo scope

- Capture is simulated and does not access a real camera. Local image selection supports files smaller than 10 MB.
- Images are previewed with the browser's FileReader API and are not uploaded to a server.
- New entries exist only in the current page's React state and reset on refresh.
- Initial entries, the homepage date, and calendar states are demonstration data, not real patient information.
- The reminder switch demonstrates a setting; it does not send notifications.
- The AI Doctor experience uses local, prewritten demo guidance based on the selected feeling. It does not analyze the image, call an AI model, or provide a medical diagnosis.
- There is no real account login, payment processing, model training, medical report generation, or electronic medical record integration.
- Basic and VIP can be switched locally for demonstration. This does not activate a membership or charge the user.
- Hospital connection, clinical summaries, review flags, test reports, and clinician goals use simulated data and do not connect to an EHR.

## Basic and VIP feature model

| Capability | Basic | VIP |
| ---------- | ----- | --- |
| Guided tongue-image capture and automatic quality checks | Included | Included |
| Basic longitudinal records, weight, symptoms, medication, tests, and reminders | Included | Included |
| Recording consistency | 7-day completion | 30-day completion plus detailed context |
| Sleep, activity, and meal factors | Today’s manually entered values | 30-day averages, weekly goals, and relationships between factors |
| Personalized support around clinician goals | Locked | Included |
| Comparison across multiple test reports | Locked | Included |
| Smart Visit Prep | Four-item summary and read-only suggested questions | 30-day changes, care-goal progress, report updates, discussion priorities, and editable questions |
| Clinical summary and review flag | Included in a hospital project | Included in a hospital project |

After hospital-sponsored access ends, users may return to Basic or choose to purchase VIP. Paid membership and hospital care relationships are managed separately.

## Technology

- React 19 and TypeScript
- Vinext and Vite 8 with an App Router structure
- Tailwind CSS 4
- shadcn / Base UI components
- Lucide React icons
- Cloudflare Workers and Sites build and hosting configuration

Business interactions currently run in the browser. The Workers configuration supports local development and hosting.

## Run locally

### Requirements

- Node.js **22.13.0 or later**; Node.js 24 is suitable.
- pnpm **11**.

If pnpm is not installed, use npm:

```bash
npm install -g pnpm@11.19.0
```

### Install and start

```bash
git clone https://github.com/Gavinbb0/Tongue_demo.git
cd Tongue_demo
pnpm install --frozen-lockfile
pnpm dev
```

Open the Local URL printed by the terminal, usually `http://localhost:3000/`. Use the actual printed address if the default port is occupied.

Dependency installation requires a network connection. No API key, database, or patient data is needed. `pnpm-workspace.yaml` explicitly allows dependency build scripts for esbuild, sharp, and workerd.

### Build and check

```bash
# Check TypeScript types
pnpm exec tsc --noEmit

# Create the production build
pnpm build

# Preview the Workers production build locally (run build first)
pnpm start
```

The repository also provides `pnpm lint` and `pnpm format`. The format command modifies files.

## Project structure

```text
Tongue_demo/
├── app/
│   ├── page.tsx            # Main screens, entry state, and dialogs
│   ├── globals.css         # Theme, mobile layout, and responsive styles
│   └── layout.tsx          # English locale, metadata, and root layout
├── components/ui/         # UI components included with the starter
├── hooks/                 # Shared hooks
├── lib/                   # Styling utilities
├── public/favicon.svg     # App icon
├── .openai/hosting.json    # Current Sites project and binding configuration
├── vite.config.ts         # Vinext, Sites, and Cloudflare configuration
├── package.json           # Dependencies and scripts
├── pnpm-lock.yaml         # Locked dependency versions
└── pnpm-workspace.yaml    # Dependency build configuration
```

## Customization

- **App name and page title:** `app/layout.tsx` and `app/page.tsx`.
- **Colors, spacing, and phone layout:** `app/globals.css`.
- **Example entries and interface text:** the `initial` array and screen content in `app/page.tsx`.
- **Plan and care-plan demo state:** update the state and feature panels in `app/page.tsx`.

`.openai/hosting.json` links to the current demo site and contains no access credentials. It does not need changes for local development. Use your own hosting project configuration for an independent deployment. Uploading code to GitHub does not automatically publish the demo.

## Usage note

This is a course UI prototype. Its content and example entries do not provide medical diagnosis or treatment advice. Use sample images for presentations and avoid committing real patient information.
