<template>
  <div class="cockpit">
    <div class="radar">
      <!-- <FramesRadar /> -->
    </div>
    <div class="info">
      <!-- <FramesInfo /> -->
    </div>
    <div class="location">
      <FramesLocation />
    </div>
    <div class="navigation">
      <FramesNavigation />
    </div>
    <div class="tool">
      <!-- <FramesTool /> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.cockpit {
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 3fr 3fr 3fr 2fr;
  grid-template-rows: 1fr auto;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  padding: $gap;
  gap: $gap;
  background-color: #181511;

  .radar {
    grid-column: 1 / span 3;
  }

  .info {
    grid-column: 4;
    grid-row: 1 / span 2;
  }

  .location, .navigation, .tool {
    aspect-ratio: 3/2;
  }

  & > * {
    border-radius: 2vw;
    overflow: hidden;
    background-color: #1f1b16;

    & > * {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  }
}
</style>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
}

p {
  font-family: $font-regular;
  font-size: 1vw;
  margin: 0;

  b {
    font-family: $font-major;
  }
}

::selection {
  user-select: none;
}
</style>
