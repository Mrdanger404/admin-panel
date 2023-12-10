/** @type {import('tailwindcss').Config} */


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {

    extend: {
      fontFamily: {
        lobster : ['lobster', 'sans-serif'],
        Bebas : ['Bebas Neue', 'sans-serif'],
        DancingScript: ['Dancing Script', 'cursive'],
        RobotoItalic: ['Roboto', 'sans-serif']
      },
      backgroundImage : {
        'bg1' : "url('https://png.pngtree.com/thumb_back/fh260/background/20201026/pngtree-futuristic-shape-abstract-background-chemistry-technology-concept-for-website-image_438818.jpg')",
        'bg2' : "url('https://steamuserimages-a.akamaihd.net/ugc/156905916534925611/94BF16E68DA50B5456C28D8E6FC70887919C41FE/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true')",
        'bg3' : "url('https://i.pinimg.com/originals/e0/2f/15/e02f15320922538383a90fee3d938f82.gif')",
        'bg4' : "url('https://img1.picmix.com/output/stamp/thumb/4/9/9/1/1841994_037e5.gif')",
        'bg5' : "url('https://64.media.tumblr.com/8ed84e1ea55c5722a8fc7fa161ab6c48/82f603cbc86775f9-08/s400x600/3681583b4aef206dbd5e27cb8e5b763f7ed16d00.gif')",
      }
    },
  },
  plugins: [],
}