'use strict';

  var VisualTimer = require('../plugins/VisualTimer');
  var Enemy = require('../prefabs/Enemy');

  function Play() {}
  Play.prototype = {
    init: function(options) {
        this.player = options.player ? options.player : 1;
        this.enemyPlayer = this.player === 1 ? 2 : 1;
        this.countPlayers = 2;
        this.level = options.level ? options.level : 1;
    },
    create: function() {
        this.stage.backgroundColor = '#292833';
        
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
		this.zoneThumbsGroup = this.game.add.group();
        this.zoneThumbsGroup.enableBody = true;
        this.zoneThumbsGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.zoneLength = GlobalGame.thumbWidth*(GlobalGame.thumbCols-1)+GlobalGame.thumbSpacing*(GlobalGame.thumbCols-1);
		this.zoneHeight = GlobalGame.thumbHeight*(GlobalGame.thumbRows-1)+GlobalGame.thumbSpacing*(GlobalGame.thumbRows-1);
        this.offsetX = this.game.width+1;
        this.offsetY = 1;
		     for(var i = 0; i < GlobalGame.thumbRows; i ++){
		     	for(var j = 0; j < GlobalGame.thumbCols; j ++){
                    var xPoszoneThumb = this.offsetX+j*(GlobalGame.thumbWidth+GlobalGame.thumbSpacing);
                    var yPoszoneThumb = this.offsetY+i*(GlobalGame.thumbHeight+GlobalGame.thumbSpacing);
                    
					var zoneThumb = this.zoneThumbsGroup.create(xPoszoneThumb, yPoszoneThumb, "sprites", "sprites/squares/lightblue");
                    zoneThumb.balls = 0;
                    zoneThumb.ballsArray = [];
                    zoneThumb.body.allowGravity = false;
	                zoneThumb.body.immovable = true;
                    
                    if(xPoszoneThumb == this.offsetX && yPoszoneThumb == this.zoneHeight+this.offsetY){
                        this.leftBottomEdgeField = zoneThumb;
                        this.leftBottomEdgeField.active = true;
                        this.leftBottomEdgeField.player = this.player;
                        this.leftBottomEdgeField.frameName = "sprites/squares/red";
                    } 
//                    else if(xPoszoneThumb == this.offsetX && yPoszoneThumb == this.offsetY){
//                        this.leftTopEdgeField = zoneThumb;
//                        this.leftTopEdgeField.active = true;
//                        this.leftTopEdgeField.player = this.enemyPlayer;
//                        this.leftTopEdgeField.frameName = "sprites/colorblocks/darkgray";
//                    } else if(xPoszoneThumb == this.zoneLength+this.offsetX && yPoszoneThumb == this.zoneHeight+this.offsetY){
//                        this.rightBottomEdgeField = zoneThumb;
//                        this.rightBottomEdgeField.active = true;
//                        this.rightBottomEdgeField.player = this.enemyPlayer;
//                        this.rightBottomEdgeField.frameName = "sprites/colorblocks/darkgray";
//                    }
                    else if(xPoszoneThumb == this.zoneLength+this.offsetX && yPoszoneThumb == this.offsetY){
                        this.rightTopEdgeField = zoneThumb;
                        this.rightTopEdgeField.active = true;
                        this.rightTopEdgeField.player = this.enemyPlayer;
                        this.rightTopEdgeField.frameName = "sprites/squares/grey";
                    }
                    
				}
			}
		this.zoneThumbsGroup.x = this.game.width * -1

        this.balls = this.game.add.group();
        this.balls.enableBody = true;
        this.balls.physicsBodyType = Phaser.Physics.ARCADE;
        this.game.time.events.loop(Phaser.Timer.SECOND*2, this.zoneUpdate, this);
        
        this.enemy = new Enemy(this.game, {id : this.enemyPlayer, startField: this.rightTopEdgeField});
        
        this.game.input.onDown.add(this.beginSwipe, this);
        
		this.game.add.plugin(Phaser.Plugin.Debug);
    },
    update: function() {
      this.game.physics.arcade.collide(this.balls, this.zoneThumbsGroup, null, this.ballZoneCollision, this);
      this.game.physics.arcade.overlap(this.balls, this.balls, this.ballCollisionHandler, null, this);
    },
    zoneUpdate: function(){
        this.zoneThumbsGroup.forEach(function(zone){
            if(zone.active && zone.balls < 5){
                var zoneballFrame = zone.player === this.player ? 'sprites/balls/ballgreen' : 'sprites/balls/ballred';
                var zoneball = this.balls.create(zone.x - this.offsetX, zone.y - this.offsetY,"sprites", zoneballFrame);
                  zoneball.player = zone.player;
                  zoneball.ballIsMoving = false;
                  zoneball.body.collideWorldBounds = true;
                  zoneball.body.bounce.setTo(1,1);
                  zoneball.body.velocity.x = this.game.rnd.integerInRange(-150,150);
                  zoneball.body.velocity.y = this.game.rnd.integerInRange(-150,150);
                  zoneball.zone = zone;
				  zone.balls += 1;
                  zone.ballsArray[zone.ballsArray.length] = zoneball;
                  this.balls.add(zoneball); 
           }
           if(zone.player === this.enemyPlayer && zone.balls >= this.game.rnd.integerInRange(1, 5)){
              this.enemy.zoneContainsMaxBalls(zone);
           }
        }, this)
    },
    beginSwipe: function(pointer){
		this.startX = this.game.input.worldX;
		this.startY = this.game.input.worldY;
        this.startPointer = pointer;
        this.game.input.onDown.remove(this.beginSwipe);
        this.game.input.onUp.add(this.endSwipe, this);
	},
    endSwipe: function(pointer){
		this.endX = this.game.input.worldX;
		this.endY = this.game.input.worldY;
        this.endPointer = pointer;
        
        var startZone = this.game.physics.arcade.getObjectsAtLocation(this.startX,this.startY, this.zoneThumbsGroup);
        var endZone = this.game.physics.arcade.getObjectsAtLocation(this.endX,this.endY, this.zoneThumbsGroup);

		if(startZone[0].player !== this.enemyPlayer && startZone.length && endZone.length && !Phaser.Point.equals(startZone[0].position, endZone[0].position)){
            for (var index = 0; index < startZone[0].ballsArray.length; index++) {
                startZone[0].ballsArray[index].ballIsMoving = true;
                startZone[0].ballsArray[index].zone = endZone[0];
                if(startZone[0].indicator) startZone[0].indicator.pause();
                this.game.physics.arcade.moveToXY(startZone[0].ballsArray[index], endZone[0].world.x, endZone[0].world.y);
                endZone[0].ballsArray[endZone[0].ballsArray.length] = startZone[0].ballsArray[index];
                endZone[0].balls++;
                if(endZone[0].indicator) endZone[0].indicator.resume();
                startZone[0].balls--;
            }
            startZone[0].ballsArray = [];
        }
        
		this.game.input.onDown.add(this.beginSwipe, this);
     	this.game.input.onUp.remove(this.endSwipe);
	},
    ballZoneCollision: function(ball, zone) {
        if(ball.ballIsMoving){
                if(this.checkOverlap(ball, ball.zone)){
                    if(this.checkOverlapAndIsInsideObject(ball, ball.zone)){
                        ball.ballIsMoving = false;
                        var timerTotalTime = Math.round(100 / ball.zone.balls);
                        if(ball.zone.player !== this.player){
                            if(ball.zone.indicator){
//                                ball.zone.indicator.setTime(timerTotalTime);
//                                ball.zone.indicator.startWithoutReset();
//                                console.log( ball.zone.indicator.remainingTime())
                            } else{
//                                console.log(timerTotalTime)
                                var playerId = this.player;
                             ball.zone.indicator = new VisualTimer({
                                    game: this.game,
                                    x: ball.zone.x - this.offsetX,
                                    y: ball.zone.y - this.offsetY,
                                    seconds: timerTotalTime,
                                    onComplete: function() {
                                        if(ball.zone.indicator) ball.zone.indicator.remove();
                                        ball.zone.player = ball.player;
                                        if(ball.zone.player === ball.player){
                                            ball.zone.frameName = ball.player === playerId ? 'sprites/squares/red' : 'sprites/squares/grey';
                                            ball.zone.active = true;
                                        }
                                    }
                                });
                                ball.zone.indicator.start();
                            }
                        }
                        return true;
                    }
                }
            return false;   
        }
    }, 
    checkOverlap: function(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }, 
    checkOverlapAndIsInsideObject: function(spriteA, spriteB) {
        var a = spriteA.getBounds(),
            b = spriteB.getBounds(),
            angle = Phaser.Math.normalizeAngle(this.game.physics.arcade.angleBetween(spriteA, spriteB));

        //  If the given rect has a larger volume than this one then it can never contain it
        if (a.volume > b.volume)
        {
            return false;
        }
        if (a.width <= 0 || a.height <= 0)
        {
            return false;
        }

        if(angle > 0.01 && angle < 0.03){
            return false
        }
        return ( a.bottom - a.height <= b.y);

    },
    ballCollisionHandler: function(ball, otherBall) {
        if(ball.player !== otherBall.player){
            if(ball.zone.indicator) ball.zone.indicator.remove();
            if(otherBall.zone.indicator) otherBall.zone.indicator.remove();
            ball.kill();
            otherBall.kill();
        }
    },
    render: function() {
    }
  };
  
  module.exports = Play;