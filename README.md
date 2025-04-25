HoverIT – Smart Mobility Meets Smart Apps

Welcome to HoverIT, a fully simulated web-based platform that showcases how smart mobility apps can enable performance monitoring, route planning, eco insights, and safety—all without physical hardware. Built for the **Hackemon Hackathon** (Galgotias University) under the theme: “Smart Mobility Meets Smart Apps”.

Live Site: [hover-it.vercel.app](https://hover-it.vercel.app)  
GitHub Repo: [Ankitanand2411/HoverIT](https://github.com/Ankitanand2411/HoverIT)

---

🚀 Problem Statement

> "Design and develop a mobile application that simulates integration with personal electric vehicles or delivery robots, enabling performance monitoring, route planning, safety features, and eco-friendly usage insights — all without the need for physical hardware."
> — HoverRobotix, Hackemon 2025

---

 🌟 Key Features

1.Real-Time Dashboard
- Battery %, motor temperature, power usage, distance covered, speed
- Regenerative braking slider and payload weight visualized
- Simulated live vehicle telemetry

2.Eco Route Planner
- Interactive map with source/destination selector
- Smart routing logic based on distance & battery
- Real-time movement and vehicle simulation

3.Safety Suite
- Obstacle avoidance training module
- Emergency braking and path-following simulation
- Randomized pedestrian/static object generation for testing

4.Eco Insights
- CO₂ saved vs. car trips
- Efficiency metrics & personalized tips
- Weekly green challenges and gamified badges

---

 🧠 Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **UI Library**: shadcn/ui (Radix-based)
- **Mapping**: OpenStreetMap
- **Simulation**: Custom logic for telemetry, vehicle motion, and challenge generation
- **Mobile-Ready**: Capacitor integration enabled
- **Backend-Ready**: Supabase configured (currently mocked for demo)

---

🧪 How to Run Locally

```bash
git clone https://github.com/Ankitanand2411/HoverIT.git
cd HoverIT
npm install
npm run dev


