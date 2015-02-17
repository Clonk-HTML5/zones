
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');
//    this.load.atlasJSONHash('sprites', 'assets/sprites.png', 'assets/sprites.json');
    this.load.atlasJSONHash('sprites', 'assets/allsprites.png', 'assets/allsprites.json');
    this.load.spritesheet('timer', 'assets/timer.png', 150, 20);

  },
  create: function() {
    this.stage.backgroundColor = '#f1c40f';
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
