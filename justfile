_default:
  @just -l

# run after cloning repository to set it up
setup:
  npm install

# run quines
run filter="":
  node run.js {{filter}}

