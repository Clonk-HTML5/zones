GlobalGame = {
	thumbRows : 9,
	thumbCols : 12,
	thumbWidth : 64,
	thumbHeight : 64,
	thumbSpacing : 1,
}

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    
    this.stage.disableVisibilityChange = true;

    if (this.game.device.desktop)
    {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setMinMax(480, 260, 800, 600);
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }
    else
    {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setMinMax(480, 260, 800, 600);
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(true, false);
        this.scale.setResizeCallback(this.gameResized, this);
//        this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
//        this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
    }
      
    this.game.state.start('preload');
  }
};

module.exports = Boot;
