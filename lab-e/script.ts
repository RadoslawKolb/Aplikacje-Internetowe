const msg: string = "Hello!";

alert(msg);

let currentStyle: string = "style1";
const styles: { [key: string]: string } = {
  "style1": "styles/style1.css",
  "style2": "styles/style2.css",
  "style3": "styles/style3.css"
};

function changeStyle(newStyle: string): void {
  if (styles[newStyle] && newStyle !== currentStyle) {
    const linkElement = document.querySelector("link[rel='stylesheet']");
    if (linkElement) {
      
      linkElement.setAttribute("href", styles[newStyle]);
      currentStyle = newStyle;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[data-style]');
  links.forEach(link => {
    link.addEventListener('click', (event) => {
      const styleName = (event.target as HTMLAnchorElement).getAttribute('data-style');
      if (styleName) {
        changeStyle(styleName);
      }
    });
  });
});