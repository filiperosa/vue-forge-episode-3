module.exports = {
  plugins: [require("daisyui"), require("@tailwindcss/typography")],

  daisyui: {
    themes: [{
      mytheme: {
        "primary": "#e53e3e",
        "secondary": "#f6d860",
        "accent": "#37cdbe",
        "neutral": "#3d4451",
        "base-100": "#ffffff",
        },
      },
    ],
  },
  
};
