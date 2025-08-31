<div align="center">

# 🌦️ Celestial Weather 🌦️

**A beautiful, AI-powered weather application built with Next.js, Genkit, and Tailwind CSS. Get real-time weather data, detailed forecasts, air quality, and lifestyle suggestions in a stunning, modern interface.**

</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Genkit-AI-orange?style=for-the-badge&logo=google&logoColor=white" alt="Genkit AI">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

Celestial Weather is more than just a weather app; it's a beautifully designed, intelligent companion for planning your day. By leveraging the power of generative AI, it provides not only precise meteorological data but also personalized suggestions for activities and places to visit. The entire experience is wrapped in a premium, responsive "glassmorphism" UI with advanced animations, making it a joy to use on any device.

## ✨ Core Features

Our application is packed with features designed to provide a comprehensive and delightful weather-checking experience.

-   🌡️ **Real-Time Weather Data**: Get instant access to a complete set of current conditions, including temperature, humidity, wind speed and direction, atmospheric pressure, visibility, UV index, and "feels like" temperature.

-   🗓️ **Detailed Forecasts**: Plan your week with a comprehensive 5-day forecast, and manage your day with a detailed 7-hour outlook. Each forecast includes temperature, conditions, and realistic weather icons.

-   🧠 **AI-Powered Suggestions**: This is where Celestial Weather truly shines. Our Genkit AI flow analyzes the current weather and generates personalized recommendations for activities (e.g., "Go for a hike," "Visit a museum") and places to visit, helping you make the most of your day.

-   🍃 **Health-Conscious Information**: Stay informed about your environment with essential health metrics. The app provides the Air Quality Index (AQI), PM2.5 and Ozone (O3) levels, and local pollen data, including the overall level and primary type (e.g., Tree, Grass).

-   📊 **Interactive Hourly Charts**: Visualize the hourly temperature and "feels like" trends with a dynamic, easy-to-read line chart. This provides an intuitive way to see how the weather will evolve throughout the day.

-   📱 **Sleek Glassmorphism UI**: The entire interface is built with a premium, responsive "glassmorphism" design. Blurred, semi-transparent backgrounds create a sense of depth and look stunning on any device, from a large desktop monitor to a small mobile phone.

-   ✨ **Advanced Animations**: The UI is brought to life with a beautiful animated starry sky background featuring twinkling and shooting stars. The homepage icons also include subtle, professional animations that make the interface feel dynamic and interactive.

## 🏛️ Architecture Overview

Celestial Weather is built on a modern, server-centric architecture that leverages the power of Next.js and Google's Genkit.

1.  **Frontend**: The user interface is built with **Next.js** and **React**, using the App Router for optimized performance and routing. Components are styled with **Tailwind CSS** and built using the **ShadCN UI** library.

2.  **AI Backend**: Instead of relying on a traditional weather API, the application uses a **Genkit AI flow**. When a user searches for a city, the frontend makes a request to this server-side flow.

3.  **Data Generation**: The Genkit flow, powered by a Google AI model, acts as a mock weather API. It receives the city name and generates a complete, structured JSON object containing all the necessary data—from the current temperature and 5-day forecast to the AI-powered activity suggestions.

4.  **Data Rendering**: The structured data is sent back to the Next.js frontend, where it is used to render the various components on the weather dashboard. This approach allows for a highly flexible and intelligent system that can provide more than just raw data.

## 🛠️ Tech Stack

This project utilizes a curated selection of modern technologies to deliver a high-quality, performant, and scalable application.

-   **Framework**: [Next.js](https://nextjs.org/) (v15, with App Router) - Provides a robust foundation with server components, optimized rendering, and a great developer experience.
-   **UI Library**: [React](https://react.dev/) (v18) - Used for building the interactive and dynamic user interface.
-   **Generative AI**: [Google Genkit](https://firebase.google.com/docs/genkit) - Powers the core AI flow that generates all weather data and personalized suggestions.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for creating the sleek, custom design.
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/) - A collection of beautifully designed, accessible, and reusable components.
-   **Charts**: [Recharts](https://recharts.org/) - Used for creating the interactive and responsive hourly forecast chart.
-   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react) - Provides the clean and modern icon set used throughout the application.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v20 or later recommended)
-   npm (or a compatible package manager like yarn or pnpm)

### Installation

1.  **Clone the Repository:**
    ```sh
    git clone https://github.com/your-username/celestial-weather.git
    cd celestial-weather
    ```

2.  **Install NPM Packages:**
    This command will install all the necessary dependencies for the project.
    ```sh
    npm install
    ```

3.  **Set Up Environment Variables:**
    Create a new file named `.env` in the root of your project. This file will hold your secret API key. Add your Google AI API key to it:
    ```env
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Run the Development Server:**
    This command will start the Next.js development server, typically on port 9002.
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/), the platform created by the makers of Next.js.

### Deploying with the Vercel CLI

For a fast and efficient deployment process, you can use the Vercel CLI.

1.  **Install the Vercel CLI:**
    ```sh
    npm install -g vercel
    ```
2.  **Log in to Vercel:**
    ```sh
    vercel login
    ```
3.  **Link the Project:**
    Navigate to your project's directory and run the `link` command. This will connect your local repository to a project on Vercel.
    ```sh
    vercel link
    ```
4.  **Add Your Environment Variable:**
    Securely add your Google AI API key as a secret.
    ```sh
    vercel env add GEMINI_API_KEY
    ```
5.  **Deploy to Production:**
    Finally, deploy your application to a production URL.
    ```sh
    vercel --prod
    ```

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.
