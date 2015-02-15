'use strict';

var Enemy = function(game, options) {
  Phaser.Group.call(this, game);
    
    this.id = options.id;
    this.startField = options.startField;
    this.zoneThumbgroup = this.game.state.getCurrentState().zoneThumbsGroup;
};

Enemy.prototype = Object.create(Phaser.Group.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  
};

Enemy.prototype.zoneContainsMaxBalls = function(zone) {
    if(zone.player === this.id){
        
        var endZone = Phaser.ArrayUtils.getRandomItem(this.zoneThumbgroup.children, 0, this.zoneThumbgroup.children.length)
        
        if(!Phaser.Point.equals(zone.position, endZone.position)){
            for (var index = 0; index < zone.ballsArray.length; index++) {
                zone.ballsArray[index].ballIsMoving = true;
                zone.ballsArray[index].zone = endZone;
                if(zone.indicator) zone.indicator.pause();
                this.game.physics.arcade.moveToXY(zone.ballsArray[index], endZone.world.x, endZone.world.y);
                endZone.ballsArray[endZone.ballsArray.length] = zone.ballsArray[index];
                endZone.balls++;
                if(endZone.indicator) endZone.indicator.resume();
                zone.balls--;
            }
            zone.ballsArray = [];
        }
    }
};

module.exports = Enemy;
