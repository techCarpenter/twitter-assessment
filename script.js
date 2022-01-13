
let followingJson = await fetch("/following.json").then(async res => {
  let reader = res.body.getReader();
  let result = "";

  let allText = await reader.read().then(function processText({ done, value }) {
    if (done) {
      // allText = result;
      return result;
    }

    result += new TextDecoder().decode(value);

    return reader.read().then(processText);
  });
  return allText;
});

let followingArray = JSON.parse(followingJson);

let root = document.querySelector("#root");
let ul = document.createElement("ul");
ul.classList.add("container");
followingArray
  .filter(item => !item.keep)
  .forEach(item => {
    let li = document.createElement("li");
    let img = document.createElement("img");
    let a = document.createElement("a");

    if (item.keep === false) {
      li.style.backgroundColor = "rgb(255, 0, 0)";
      a.style.color = "black";
      a.style.fontWeight = "700";
    }

    a.href = "https://twitter.com/" + item.handle;
    a.innerText = item.name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.style.paddingRight = "0.5rem";

    img.src = item.photoUrl;
    img.height = 50;
    img.width = 50;

    li.appendChild(img);
    li.appendChild(a);
    ul.appendChild(li);
  });

root.appendChild(ul);

followingArray.sort((a, b) => {
  if (a.keep === false) {
    return -1;
  } else if (b.keep === false) {
    return 1;
  } else if (b.keep === null) {
    return 1;
  } else if (a.keep === null) {
    return -1;
  } else {
    return 0;
  }
});

let button = document.createElement("button");
button.innerText = "Copy JSON"
button.onclick = () => {
  navigator.clipboard.writeText(JSON.stringify(followingArray));
};

root.appendChild(button);

console.log("Keep: ", followingArray.filter(item => item.keep === true).length);
console.log(
  "Unsure: ",
  followingArray.filter(item => item.keep === null).length
);
console.log(
  "Unfollow",
  followingArray.filter(item => item.keep === false).length
);
console.log("Total: ", followingArray.length);
