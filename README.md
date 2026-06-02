# 🎮 Sagar Mehla — Game Portfolio

> A retro 2D Mario-style developer portfolio. Recruiters navigate a pixel-art world, enter buildings, and discover projects, skills, trophies & more.

[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![Live Demo](https://img.shields.io/badge/Live-Demo-00e5ff)](https://github.com/sagardevlab/game-portfolio)

---

## 📸 Preview

The portfolio loads as a full-screen retro game:
- A pixel-art character (with a red **S** cap) walks across a side-scrolling world map
- Five buildings glow when approached: **Home**, **Projects**, **Skills**, **Trophies**, **Contact**
- Press **ENTER** near a building to open an in-game dialog with real portfolio content
- Collect 🪙 coins scattered across the map
- 8-bit sound effects via Web Audio API — no external files

---

## 🏗️ Project Structure

```
game-portfolio/
├── pom.xml                                   # Maven build file
├── Dockerfile                                # Docker deploy
├── README.md
└── src/
    ├── main/
    │   ├── java/com/sagar/portfolio/
    │   │   ├── PortfolioApplication.java      # Entry point
    │   │   ├── config/
    │   │   │   ├── CacheConfig.java           # In-memory cache setup
    │   │   │   ├── GlobalExceptionHandler.java
    │   │   │   └── WebConfig.java             # CORS + static resources
    │   │   ├── controller/
    │   │   │   ├── GameController.java        # GET / → serves game.html
    │   │   │   └── PortfolioApiController.java # REST: /api/*
    │   │   ├── dto/
    │   │   │   ├── ApiResponse.java           # Generic response wrapper
    │   │   │   └── ContactFormDto.java        # Contact form payload
    │   │   ├── model/
    │   │   │   ├── Project.java
    │   │   │   ├── Skill.java
    │   │   │   └── Trophy.java
    │   │   └── service/
    │   │       ├── ContactService.java        # Logs contact (wire email here)
    │   │       └── PortfolioDataService.java  # All portfolio data
    │   └── resources/
    │       ├── application.properties
    │       ├── templates/
    │       │   ├── game.html                  # Main Thymeleaf page
    │       │   └── error.html                 # 💀 GAME OVER page
    │       └── static/
    │           ├── css/game.css               # Full game styles
    │           └── js/
    │               ├── AudioManager.js        # 8-bit Web Audio engine
    │               ├── Camera.js              # Smooth scrolling camera
    │               ├── GameMap.js             # World layout (platforms, buildings…)
    │               ├── Player.js              # Physics + movement + coin pickup
    │               ├── SpriteRenderer.js      # Canvas 2D pixel art drawing
    │               ├── ApiClient.js           # Fetch wrappers → Spring REST
    │               ├── UIBuilder.js           # Dialog HTML builders
    │               ├── DialogManager.js       # Open/close zone dialogs
    │               └── GameEngine.js          # Main game loop (RAF)
    └── test/
        └── java/com/sagar/portfolio/
            └── PortfolioApplicationTests.java
```

---

## 🚀 Running Locally

### Prerequisites
- Java 17+
- Maven 3.8+

### Steps

```bash
# 1. Clone
git clone https://github.com/sagardevlab/game-portfolio.git
cd game-portfolio

# 2. Build
mvn clean package -DskipTests

# 3. Run
java -jar target/portfolio-1.0.0.jar

# 4. Open browser
open http://localhost:8080
```

Or use the Spring Boot Maven plugin directly:

```bash
mvn spring-boot:run
```

---

## 🐳 Docker

```bash
# Build image
docker build -t game-portfolio .

# Run container
docker run -p 8080:8080 game-portfolio
```

---

## ☁️ Deployment Options

### Render (Free tier — recommended)
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect repo, set **Build Command**: `mvn package -DskipTests`
4. Set **Start Command**: `java -jar target/portfolio-1.0.0.jar`
5. Set environment variable `PORT=10000` (Render's default)
6. Deploy 🚀

### Railway
1. Push to GitHub
2. New project → Deploy from GitHub repo
3. Railway auto-detects Spring Boot and sets `PORT`

### Fly.io
```bash
fly launch --dockerfile Dockerfile
fly deploy
```

### AWS / Azure / GCP
Use the Dockerfile with any container service (ECS, App Service, Cloud Run).

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| `← / A` | Move left |
| `→ / D` | Move right |
| `↑ / W / SPACE` | Jump |
| `ENTER` | Enter nearby building |
| `ESC` | Close dialog |

Mobile: on-screen D-pad and action buttons auto-appear.

---

## 🔧 Customising Your Data

All portfolio data lives in one file:

**`src/main/resources/...service/PortfolioDataService.java`**

Edit the following methods to add your own content:
- `getAllProjects()` — add/modify your GitHub projects
- `getAllSkills()` — update skill levels and categories
- `getAllTrophies()` — update achievements/certifications
- `getPlayerStats()` — update name, title, location, links

### Adding Email for Contact Form

In `ContactService.java`, uncomment and wire in a mail sender:

```java
// Spring Mail
@Autowired JavaMailSender mailSender;

// Or use SendGrid / Mailgun SDK
```

Add to `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your@email.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2.5 |
| Template | Thymeleaf 3 |
| Frontend | Vanilla JS (ES6 modules), HTML5 Canvas 2D |
| Audio | Web Audio API (no external files) |
| Build | Maven 3 |
| Cache | Spring Cache + ConcurrentMapCacheManager |
| Deploy | Docker, Render, Railway, Fly.io |

---

## 📡 REST API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/player-stats` | GET | Name, level, XP, links |
| `/api/projects` | GET | All projects |
| `/api/projects/{id}` | GET | Single project |
| `/api/skills` | GET | All skills |
| `/api/skills/{category}` | GET | Skills by category |
| `/api/trophies` | GET | All trophies |
| `/api/contact` | POST | Submit contact form |
| `/api/health` | GET | Health check |

---

## 👤 Author

**Sagar Mehla**
- 🐙 GitHub: [@sagardevlab](https://github.com/sagardevlab)
- 🔵 LinkedIn: [sagarmehla](https://www.linkedin.com/in/sagarmehla/)
- 📍 Bengaluru, India

---

## 📄 License

MIT — feel free to fork and build your own game portfolio!
