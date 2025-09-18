# Racing-2d-game
2D car racing game web app
```Plain Text
racing-2d-game/
│
├── .gitignore
├── README.md
├── LICENSE
│
├── docs/                        # Documentation, screenshots, gameplay GIFs
│   └── demo.gif
│
├── assets/                      # Common game assets
│   ├── images/
│   │   ├── car.png
│   │   ├── obstacle.png
│   │   ├── star.png
│   │   ├── fuel.png
│   │   └── road.png
│   └── sounds/
│       ├── engine.mp3
│       ├── crash.mp3
│       └── pickup.mp3
│
├── web-game/                    # Main web version (Canvas + JS)
│   ├── index.html
│   ├── style.css
│   └── game.js
│
├── streamlit-app/               # Alternative Streamlit version (runs on cloud)
│   ├── app.py
│   ├── requirements.txt
│   └── streamlit_assets/
│       ├── car.png
│       ├── obstacle.png
│       └── road.png
│
└── .github/
    └── workflows/               # CI/CD for GitHub Pages + Streamlit deploy
        ├── deploy-pages.yml
        └── deploy-streamlit.yml




```
