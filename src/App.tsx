import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
// @ts-expect-error -- Globe.jsx is not yet a .tsx module
import Globe from "@/components/Globe.jsx"; // Import the Globe component
import './App.css' // Assuming your global styles are here, including Tailwind

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="relative flex flex-col justify-center min-h-svh w-full p-4 overflow-hidden">
        {/* Globe as a background element, fills this outer container */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <Globe size={Math.hypot(window.innerWidth, window.innerHeight)*0.4} rotationSpeed={0.1} />
        </div>

        {/* ModeToggle positioned at the top right of the page */}
        <div className="absolute top-4 right-4 z-20"> 
          <ModeToggle />
        </div>

        {/* Existing content, ensuring it's on top with z-index if needed */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Historai</h1>
            <p className="text-xl text-muted-foreground">
              Explore, Discover, and Experience History.
            </p>
          </header>
          
          <main className="text-center">
            <p className="text-lg mb-8 max-w-2xl">
              Welcome to Historai, your gateway to understanding the past. 
              We are building a platform to bring historical events to life through interactive globes, timelines, and immersive VR/AR experiences.
            </p>
            <p className="text-2xl font-semibold text-primary mb-2">
              Coming Soon!
            </p>
            <p className="text-md text-muted-foreground">
              Our team is hard at work crafting this unique educational tool. Stay tuned for updates.
            </p>
          </main>
          
          <footer className="mt-12 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Historai. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
