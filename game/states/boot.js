GlobalGame = {
	thumbRows : 5,
	thumbCols : 7,
	thumbWidth : 80,
	thumbHeight : 80,
	thumbSpacing : 1,
}

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.stage.backgroundColor = '#f1c40f';
      
    this.game.input.maxPointers = 1;
    
    this.stage.disableVisibilityChange = true;

    if (this.game.device.desktop)
    {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setMinMax(480, 260, 568, 406);
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }
    else
    {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setMinMax(480, 260, 568, 406);
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
