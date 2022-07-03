<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
.g-button {
  display: inline-block;
  height: 44px;
  line-height: 44px;
  text-align: center;
  border-radius: 5px;
  background-color: pink;
}
.g-button:focus {
  border-color: transparent;
  box-shadow: 0 0 0 2px #63b1bc;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: inherit;
  font-family: inherit;
  line-height: 1.2em;
  text-decoration: none;
}
*::-moz-focus-inner {
  border: 0;
}
*:focus {
  outline: none;
}
*[hidden] {
  display: none;
}
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: "museo-sans", "Trebuchet MS", sans-serif;
  background: #ffffff;
}
input,
select,
textarea {
  font-family: "museo-sans", "Trebuchet MS", sans-serif;
}
u {
  text-decoration: underline;
}
button {
  font-size: inherit;
  font-family: inherit;
  background-color: transparent;
  border: 0;
  cursor: pointer;
}
a:focus {
  color: inherit;
  text-decoration: none;
}
a:focus,
button:focus {
  outline: 0;
}
textarea {
  overflow: auto;
  resize: none;
}
#app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
</style>
