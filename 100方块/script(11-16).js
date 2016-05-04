/// <reference path="lufylegend-1.9.10.min.js" />




(function (exp) {
    exp.onresize = function () { LGlobal.resize(); }
    LGlobal.destroy = true; //保证游戏中的不用的对象能够顺利被释放
    //LGlobal.preventDefault = false;
    LGlobal.stageScale = LStageScaleMode.EXACT_FIT;
    //全局变量
    (function () {
        exp.time = 0;
        exp.score1;
        exp.score2;
        exp.but_voice;
        exp.but_game;
        exp.item_x = 10;
        exp.item_y = 10;
        exp.gameMainPanel;
        exp.bgBlocks;
        exp.BlocksWrap;
        exp.activeBlock = undefined;
        exp.score_x = [];//横向清除行
        exp.score_y = [];//纵向清除列
        exp.imgData = new Array(
            { name: "number1_0", path: "img/number1/number1_0.png" },
            { name: "number1_1", path: "img/number1/number1_1.png" },
            { name: "number1_2", path: "img/number1/number1_2.png" },
            { name: "number1_3", path: "img/number1/number1_3.png" },
            { name: "number1_4", path: "img/number1/number1_4.png" },
            { name: "number1_5", path: "img/number1/number1_5.png" },
            { name: "number1_6", path: "img/number1/number1_6.png" },
            { name: "number1_7", path: "img/number1/number1_7.png" },
            { name: "number1_8", path: "img/number1/number1_8.png" },
            { name: "number1_9", path: "img/number1/number1_9.png" },
            { name: "number2_0", path: "img/number2/number1_0.png" },
            { name: "number2_1", path: "img/number2/number1_1.png" },
            { name: "number2_2", path: "img/number2/number1_2.png" },
            { name: "number2_3", path: "img/number2/number1_3.png" },
            { name: "number2_4", path: "img/number2/number1_4.png" },
            { name: "number2_5", path: "img/number2/number1_5.png" },
            { name: "number2_6", path: "img/number2/number1_6.png" },
            { name: "number2_7", path: "img/number2/number1_7.png" },
            { name: "number2_8", path: "img/number2/number1_8.png" },
            { name: "number2_9", path: "img/number2/number1_9.png" },

            { name: "icon_share", path: "img/icon_share.png" },
            { name: "over_bg", path: "img/over_bg.png" },
            { name: "stop", path: "img/stop.png" },
            { name: "play", path: "img/play.png" },
            { name: "jiangbei", path: "img/jiangbei.png" },
            { name: "fk_de_2", path: "img/fk_de_2.png" },
            { name: "icon_voice", path: "img/icon_voice.png" }
        );
    })();
    //工具及扩展
    (function () {
        exp.extend = function () {
            var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                i = 2;
            }
            if (typeof target !== "object" && !jQuery.isFunction(target))
                target = {};
            if (length == i) { target = this; --i; }
            for (i = 0; i < length; i++)
                if ((options = arguments[i]) != null)
                    for (var name in options) {
                        var src = target[name], copy = options[name];
                        if (target === copy) continue;
                        if (deep && copy && typeof copy === "object" && !copy.nodeType)
                            target[name] = jQuery.extend(deep,
                            src || (copy.length != null ? [] : {}), copy);
                        else
                            if (copy !== undefined) target[name] = copy;
                    }
            return target;
        };
        //获取随机数
        exp.getRedom = function (minNum, maxNum) {
            switch (arguments.length) {
                case 1: return parseInt(Math.random() * minNum + 1);
                case 2: return parseInt(Math.random() * (maxNum - minNum + 1) + minNum);
                default: return 0;
            }
        }
        exp.playSound = function (soundRole, time, callBack) {
            var _sound = new LSound();
            _sound.load("sound/" + soundRole + (isClearCacheImg ? "?v=" + version : ""));
            _sound.addEventListener(LEvent.COMPLETE, function () {
                if (callBack) callBack.call(_sound);
                if (time != 0) {
                    window.setTimeout(function () { _sound.stop(); }, time);
                }
            });
        }
        //居中
        LTextField.prototype.align = function (parent) {
            if (parent) {
                this.x = (parent.getWidth() - this.getWidth()) / 2;
            } else {
                this.x = (LGlobal.width - this.getWidth()) / 2;
            }
        }
        LTextField.prototype.alignY = function (parent) {
            if (parent) {
                this.y = (parent.getHeight() - this.getHeight()) / 2;
            } else {
                this.y = (LGlobal.height - this.getHeight()) / 2;
            }
        }
        LSprite.prototype.ObjectList = function (typeName) {
            var _arr = new Array();
            for (var i = 0, l = this.childList.length; i < l; i++) {
                var item = this.childList[i];
                if (item.type === typeName) {
                    _arr.push(item);
                }
            }
            return _arr;
        }
        LShape.prototype.relationSprite = null;
        LSprite.prototype.align = function (parent) {
            if (parent) {
                this.x = (parent.getWidth() - this.getWidth()) / 2;
            } else {
                this.x = (LGlobal.width - this.getWidth()) / 2;
            }
        }
        LSprite.prototype.isActive = false;
        LSprite.prototype.alignY = function (parent) {
            if (parent) {
                this.y = (parent.getHeight() - this.getHeight()) / 2;
            } else {
                this.y = (LGlobal.height - this.getHeight()) / 2;
            }
        }
        //居中
        //加入层
        exp.createSprite = function (option, callBack) {
            if (typeof option == "function") {
                var _sprite = new LSprite();
                option.call(_sprite);
                return _sprite;
            }
            var _option = extend({
                x: 0,
                y: 0,
                image: "",
                click: undefined,
            }, option || {});
            var _sprite = new LSprite();
            _sprite.x = _option.x;
            _sprite.y = _option.y;
            if (_option.image != "") {
                var bitmap = new LBitmap(new LBitmapData(imglist[_option.image]));
                _sprite.addChild(bitmap);
            }
            if (_option.click) {
                _sprite.addEventListener(LMouseEvent.MOUSE_UP, function (e) {
                    _option.click.call(_sprite, e);
                });
            }
            if (callBack) {
                callBack.call(_sprite);
            }
            return _sprite;
        }
        exp.createText = function (text, option, callBack) {
            var _option = extend({
                x: 0,
                y: 0,
                color: "#ae7318",
                size: 20
            }, option || {});
            var _text = new LTextField();
            _text.text = text;
            _text.size = _option.size;
            _text.color = _option.color;
            _text.y = _option.y;
            _text.x = _option.x;
            if (callBack) { callBack.call(_text); }
            return _text;
        }
        function Trip(text, time) {
            base(this, LSprite, []);
            this.text = text; this.time = time;
            this.setView();
            return this;
        }
        Trip.prototype.setView = function () {
            var _self = this;
            var shape = new LShape();
            var _text = createText(_self.text, { color: "#fff", size: 24 });

            shape.graphics.drawRect(0, "#ff0000", [10, 10, _text.getWidth() + 40, 50], true, "#000000");
            shape.y = 800; _text.y = 820;
            shape.x = (LGlobal.width - shape.getWidth()) / 2;
            _text.x = (LGlobal.width - _text.getWidth()) / 2 + 10;
            _self.addChild(shape);
            _self.addChild(_text);
            _self.close = function () { LTweenLite.to(_self, 0.6, { loop: false, ease: LEasing.Sine.easeOut, alpha: 0, onComplete: function () { _self.remove(); } }); }
            if (_self.time != 0) {
                window.setTimeout(function () {
                    _self.close();
                }, _self.time);
            }
        }
        Trip.prototype.text = "";
        Trip.prototype.time = "";
        Trip.prototype.close = function () { };
        Array.prototype.isContain = function (item) {
            var isPass = false;
            //this.forEach(function (e) { if (e == item) { isPass = true; return false; } });//forEach循环无法跳出，暂时弃用
            for (var i = 0; i < this.length; i++) { if (this[i] == item) { isPass = true; break; } }
            return isPass;
        }
        exp.Trip = Trip;
    })();

    function main() {
        LSystem.screen(LStage.FULL_SCREEN);
        backLayer = createSprite();
        backLayer.graphics.drawRect(1, "#cccccc", [0, 0, LGlobal.width, LGlobal.height], true, "#000000");
        //背景显示
        addChild(backLayer);
        loadingLayer = new LoadingSample1();
        backLayer.addChild(loadingLayer);

        LLoadManage.load(imgData, function (progress) {
            loadingLayer.setProgress(progress);
        }, gameInit);
        LGlobal.setDebug(true);
        addChild(new FPS());
    }
    function gameInit(result) {
        //取得图片读取结果
        exp.imglist = result;
        //移除进度条层//移除或者这样写 loadingLayer.remove();
        //backLayer.removeChild(loadingLayer);
        backLayer.die();
        backLayer.removeAllChild();
        backLayer.graphics.drawRect(0, "#cccccc", [0, 0, LGlobal.width, LGlobal.height], true, "#ffffff");
        gameCommon.init();
    }
    var initPages = {
        indexPage: function () {
            var returnPage = new LSprite();
            //加入时间层
            //var timePanel = createSprite({ x: 25, y: 117 }, function () {
            //    var shape = new LShape();
            //    shape.graphics.drawRoundRect(0, "#ff0000", [0, 0, 92, 35, 10], true, "#BFD09B");
            //    this.addChild(shape);
            //    var _time = createText("00:00", { size: 28, color: "#ffffff" });
            //    this.addChild(_time); _time.align(this); _time.alignY(this); _time.y -= 2; //_time.x += 5; _time.y += 3;
            //});
            //returnPage.addChild(timePanel);
            //加入音效按钮
            but_voice = new LButton(new LBitmap(new LBitmapData(imglist["icon_voice"])), new LBitmap(new LBitmapData(imglist["icon_voice"])));
            but_voice.x = 25; but_voice.y = 80;
            //but_game = new LButton(new LBitmap(new LBitmapData(imglist["play"])), new LBitmap(new LBitmapData(imglist["play"])));
            //but_game.x = 540; but_game.y = 80; but_game.scaleX = but_game.scaleY = 0.5;


            //score1 = createText("0", { size: 60, x: 120, y: 75, color: "#97DC65" });
            score1 = new Number("000"); score1.x = 120; score1.y = 80;
            score1.defaultlength = 3; score1.spacing = 4; //score1.setNumber(3);

            returnPage.addChild(createSprite({ x: 250, y: 35, image: "jiangbei" }));

            //score2 = createText("123", { size: 60, x: 400, y: 75, color: "#46B4E6" });
            score2 = new Number("000", 1, 2); score2.x = 400; score2.y = 80;
            score2.defaultlength = 3; score2.spacing = 4; score2.setNumber(425);

            returnPage.addChild(but_voice); //returnPage.addChild(but_game);
            returnPage.addChild(score1); returnPage.addChild(score2);
            gameMainPanel = createSprite({ x: 45, y: 200 });
            bgBlocks = new Array();
            for (var i = 0; i < item_x; i++) {
                var _y = 55 * i;
                bgBlocks.push(new Array());
                for (var j = 0; j < item_y; j++) {
                    bgBlocks[i][j] = { sign: 0, color: "#E2E2E2" };//transparent
                    var _x = 55 * j;
                    var _block = new LSprite(); _block.x = _x; _block.y = _y;
                    var shape = new LShape();
                    shape.graphics.drawRoundRect(0, "#ff0000", [0, 0, 52, 52, 7], true, bgBlocks[i][j].color);
                    _block.addChild(shape);
                    gameMainPanel.addChild(_block);
                }
            }
            returnPage.addChild(gameMainPanel);
            return returnPage;
        },
        gameOver: function () {
            var returnPage = new LSprite();
            returnPage.addChild(createSprite({ image: "over_bg" }));
            returnPage.addChild(createText("游戏结束", { y: 220, color: "#ffffff", size: 40 }, function () { this.align(); }));
            returnPage.addChild(createText(score1.value, { y: 390, color: "#ffffff", size: 40 }, function () { this.align(); }));
            returnPage.addChild(createSprite({ image: "icon_share", x: 450, y: 380, click: function () { alert(0); } }));
            return returnPage;
        }
    }
    var gameCommon = {
        //初始化游戏
        init: function () {
            //初始化界面
            backLayer.addChild(initPages.indexPage());
            BlocksWrap = createSprite();
            addChild(BlocksWrap);

            LMouseEventContainer.set(LMouseEvent.MOUSE_MOVE, true);
            LMouseEventContainer.set(LMouseEvent.MOUSE_UP, true);
            LMouseEventContainer.set(LMouseEvent.MOUSE_DOWN, true);
            LMouseEventContainer.set(LMouseEvent.MOUSE_OUT, true);
            backLayer.addEventListener(LMouseEvent.MOUSE_OUT, function (e) {
                if (activeBlock) {
                    activeBlock.stopDrag();
                    LTweenLite.to(activeBlock, 0.2, { scaleX: 0.5, scaleY: 0.5, x: activeBlock.position.x, y: activeBlock.position.y, ease: LEasing.Sine.easeOut, });
                    activeBlock = undefined;
                }
            });
            backLayer.addEventListener(LMouseEvent.MOUSE_MOVE, function (e) {
                if (!activeBlock) return false;
                //if (activeBlock.x <= 0 || activeBlock.x >= LGlobal.width - activeBlock.width / 2 || activeBlock.y >= LGlobal.height || activeBlock.y <= activeBlock.height) {
                //    activeBlock.stopDrag();
                //    LTweenLite.to(activeBlock, 0.2, { scaleX: 0.5, scaleY: 0.5, x: activeBlock.position.x, y: activeBlock.position.y, ease: LEasing.Sine.easeOut, });
                //    activeBlock = undefined;
                //} else {
                //    activeBlock.x = e.offsetX - activeBlock.width / 2;
                //    activeBlock.y = e.offsetY - activeBlock.cony;////activeBlock.height / 2 - activeBlock.height;
                //}
                activeBlock.x = e.offsetX - activeBlock.width / 2;
                activeBlock.y = e.offsetY - activeBlock.cony;
            });
            backLayer.addEventListener(LMouseEvent.MOUSE_UP, function (e) {
                if (!activeBlock) return false;
                if (!gameCommon.testState(activeBlock)) {
                    activeBlock.stopDrag();
                    LTweenLite.to(activeBlock, 0.2, { scaleX: 0.5, scaleY: 0.5, x: activeBlock.position.x, y: activeBlock.position.y, ease: LEasing.Sine.easeOut, onComplete: function () { } })
                    //.to(activeBlock, 0.2, { x: activeBlock.position.x, y: activeBlock.position.y, ease: LEasing.Sine.easeOut, });
                    activeBlock = undefined;
                } else {
                    activeBlock.remove();
                    gameCommon.refreshMainPanel();
                    if (BlocksWrap.ObjectList("LSprite").length == 0) {
                        gameCommon.addWaitBlocks();
                    }
                }
                activeBlock = undefined;
            });
            exp.blockShape1 = new LShape();
            exp.blockShape2 = new LShape();
            exp.blockShape3 = new LShape();
            blockShape1.graphics.drawRoundRect(0, "#ff0000", [10, 760, 200, 200, 7], true, "#fff");
            blockShape2.graphics.drawRoundRect(0, "#ff0000", [220, 760, 200, 200, 7], true, "#fff");
            blockShape3.graphics.drawRoundRect(0, "#ff0000", [430, 760, 200, 200, 7], true, "#fff");
            BlocksWrap.addChild(blockShape1);
            BlocksWrap.addChild(blockShape2);
            BlocksWrap.addChild(blockShape3);
            var arr = BlocksWrap.ObjectList("LShape");
            for (var i = 0, l = arr.length; i < l; i++) {
                (function (arg) {
                    var _shape = arr[arg];
                    _shape.addEventListener(LMouseEvent.MOUSE_DOWN, function (e) {
                        var _self = e.clickTarget.relationSprite;
                        if (_self.state == 3) { return false; }
                        _self.startDrag(e.touchPointID);
                        //_con_x = e.offsetX;
                        //_con_y = e.offsetY;
                        _self.x = e.offsetX - _self.width / 2;
                        _self.y = e.offsetY - _self.cony;//_self.height / 2 - _self.height;
                        _self.state = 2;
                        activeBlock = _self;
                        LTweenLite.to(_self, 0.06, { scaleX: 1, scaleY: 1 });

                    });
                })(i);
            }
            //初始化方块组
            this.addWaitBlocks();
        },
        //加入方块组至待放置区域
        addWaitBlocks: function () {
            var _block1 = new Block(getRedom(0, 16)); _block1.x = 250; _block1.y = 860 - _block1.getHeight() / 2; _block1.alpha = 0;
            BlocksWrap.addChild(_block1);
            var _block2 = new Block(getRedom(0, 16)); _block2.x = 480; _block2.y = 860 - _block2.getHeight() / 2; _block2.alpha = 0;
            BlocksWrap.addChild(_block2);
            var _block3 = new Block(getRedom(0, 16)); _block3.x = LGlobal.width; _block3.y = 860 - _block3.getHeight() / 2; _block3.alpha = 0;
            BlocksWrap.addChild(_block3);
            var b_x1 = 110 - _block1.getWidth() / 2;
            var b_x2 = 320 - _block2.getWidth() / 2;
            var b_x3 = 530 - _block3.getWidth() / 2;
            blockShape1.relationSprite = _block1;
            blockShape2.relationSprite = _block2;
            blockShape3.relationSprite = _block3;
            LTweenLite.to(_block1, 0.1, { x: b_x1, alpha: 1, onComplete: function (e) { _block1.position = { x: _block1.x, y: _block1.y }; } });
            LTweenLite.to(_block2, 0.1, { x: b_x2, alpha: 1, onComplete: function (e) { _block2.position = { x: _block2.x, y: _block2.y }; } });
            LTweenLite.to(_block3, 0.1, { x: b_x3, alpha: 1, onComplete: function (e) { _block3.position = { x: _block3.x, y: _block3.y }; } });

            gameCommon.isGameOver();

        },
        //刷新主游戏区域 
        refreshMainPanel: function () {
            gameMainPanel.removeAllChild();
            var eff = 1; var _index = 0;
            var backFn = function () {
                if (BlocksWrap.ObjectList("LSprite").length != 0) {
                    gameCommon.isGameOver();
                }
            }
            for (var i = 0, l = bgBlocks.length; i < l; i++) {
                var _y = 55 * i;
                for (var j = 0, l2 = bgBlocks[i].length; j < l2; j++) {
                    var _x = 55 * j;
                    var shape = new LShape();
                    var _block = createSprite({ x: _x, y: _y }, function () {
                        shape.graphics.drawRoundRect(0, "#ff0000", [0, 0, 52, 52, 7], true, bgBlocks[i][j].color);
                        this.addChild(shape);
                    });
                    //检测是否属于横向消减行\是否属于纵向消减列
                    if (score_x.isContain(i) || score_y.isContain(j)) {
                        var _block2 = createSprite({ x: _x, y: _y }, function () {
                            var shape2 = new LShape(); shape2.graphics.drawRoundRect(0, "#ff0000", [0, 0, 52, 52, 7], true, "#E2E2E2");
                            this.addChild(shape2);
                        });
                        gameMainPanel.addChild(_block2);
                        var blockWrap = createSprite({ x: _block.x, y: _block.y }, function () {
                            this.addChild(_block);
                            _block.x = _block.getWidth() / 2; _block.y = _block.getHeight() / 2;
                            shape.x = -shape.getWidth() / 2; shape.y = -shape.getHeight() / 2;
                            eff = eff * 0.8;
                        });
                        //var blockWrap = new LSprite(); blockWrap.x = _block.x; blockWrap.y = _block.y;
                        //blockWrap.addChild(_block);
                        //_block.x = _block.getWidth() / 2; _block.y = _block.getHeight() / 2;
                        //shape.x = -shape.getWidth() / 2; shape.y = -shape.getHeight() / 2;
                        //eff = eff * 0.8;
                        LTweenLite.to(blockWrap.getChildAt(0), eff, {
                            scaleX: 0, scaleY: 0, ease: LEasing.Sine.easeOut, onComplete: function () { blockWrap.remove(); }
                        });
                        bgBlocks[i][j].sign = 0; bgBlocks[i][j].color = "#E2E2E2";
                        gameMainPanel.addChild(blockWrap);
                    } else {
                        gameMainPanel.addChild(_block);//createSprite({ image: "fk_de_2", x: _x, y: _y }));
                    }
                    //console.log(_block.x + "==" + _block.y);
                }
            }
            if (score_x.length != 0 || score_y.length != 0) {
                window.setTimeout(function () { backFn(); }, eff * 1000);
                goneLine = score_x.length + score_y.length;
                var score = 0;
                //switch (goneLine) {
                //    case 1:
                //        score = 1; break;
                //    case 2:
                //        score = 3; break;
                //    case 3:
                //        score = 6; break;
                //    case 4:
                //        score = 10; break;
                //    case 5:
                //        score = 15; break;
                //    case 6:
                //        score = 21; break;
                //}
                score = goneLine;
                var _s = parseInt(score1.value);
                score1.setNumber(_s + score);
                score_x = [];
                score_y = [];
            } else {
                backFn();
            }
        },
        //检测方块组是否可以放置在最近位置 ，获取消减行列
        isGameOver: function () {
            var isPass = false;
            var fn = function (block, x, y) {
                //var isStand = true;
                for (var i = 0, l = block.blockData.length; i < l; i++) {
                    for (var j = 0, l2 = block.blockData[i].length; j < l2; j++) {
                        if (block.blockData[i][j] == 1) {
                            if ((x + j >= item_x) || (y + i >= item_y)) { return false; }
                            if (bgBlocks[y + i][x + j].sign == 1) { return false; }
                        }
                    }
                }
                return true;
            }
            var arr = BlocksWrap.ObjectList("LSprite");
            for (var i = 0, l = arr.length; i < l; i++) {
                var _block = arr[i];
                for (var x = 0; x < item_x; x++) {
                    for (var y = 0; y < item_y; y++) {
                        if (bgBlocks[y][x].sign == 1) { continue; }
                        if (fn(_block, x, y)) { return true; }
                    }
                }
            }
            addChild(initPages.gameOver());
            //alert("game over");
            return false;
        },
        testState: function (block) {
            //获取落点
            if (block.x < gameMainPanel.x - 20 || gameMainPanel.x > gameMainPanel.x + gameMainPanel.getWidth() + 20) { return false; }
            if (block.y < gameMainPanel.y - 20 || gameMainPanel.y > gameMainPanel.y + gameMainPanel.getHeight() + 20) { return false; }
            var con_temp = 100000; var goalBlock; var goalBlock_index_x = 100; var goalBlock_index_y = 100;
            for (var item in gameMainPanel.childList) {
                if (!gameMainPanel.childList.hasOwnProperty(item)) { continue; }
                var _item = gameMainPanel.childList[item];
                var con_x = Math.abs(block.x - (_item.x + gameMainPanel.x));
                var con_y = Math.abs(block.y - (_item.y + gameMainPanel.y));
                if ((con_x + con_y) < con_temp) {
                    con_temp = (con_x + con_y); goalBlock = _item;
                    goalBlock_index_x = goalBlock.x / 55;
                    goalBlock_index_y = goalBlock.y / 55;
                };
            }
            //alert(goalBlock_index_x + "==" + goalBlock_index_y);
            //判断是否可以放置
            for (var i = 0, l = block.blockData.length; i < l; i++) {
                for (var j = 0, l2 = block.blockData[i].length; j < l2; j++) {
                    if (block.blockData[i][j] == 1) {
                        if ((goalBlock_index_x + j >= item_x) || (goalBlock_index_y + i >= item_y)) { return false; }
                        if (bgBlocks[goalBlock_index_y + i][goalBlock_index_x + j].sign == 1) { return false; }
                    }
                }
            }
            //开始放置
            for (var i = 0, l = block.blockData.length; i < l; i++) {
                for (var j = 0, l2 = block.blockData[i].length; j < l2; j++) {
                    if (block.blockData[i][j] == 1) {
                        bgBlocks[goalBlock_index_y + i][goalBlock_index_x + j].sign = 1;
                        bgBlocks[goalBlock_index_y + i][goalBlock_index_x + j].color = block.color;
                    }
                }
            }
            //横向满格
            for (var i = 0, l = item_y; i < l; i++) {
                var isFull = true;
                for (var j = 0, l2 = bgBlocks[i].length; j < l2; j++) {
                    if (bgBlocks[i][j].sign == 0) { isFull = false; continue; }
                }
                if (isFull) { score_x.push(i); }
            }
            //纵向满格
            for (var i = 0; i < item_x; i++) {
                var isFull = true;
                for (var j = 0, l2 = bgBlocks[i].length; j < l2; j++) {
                    if (bgBlocks[j][i].sign == 0) { isFull = false; continue; }
                }
                if (isFull) { score_y.push(i); }
            }
            return true;
        }
    }
    var sharpStorage = (function () {
        var sharpTypes = new Array();//17个图像
        sharpTypes.push({ name: "", color: "#7C8FD5", data: [[1]] });

        sharpTypes.push({ name: "", color: "#FFC540", data: [[1, 1]] });
        sharpTypes.push({ name: "", color: "#FFC540", data: [[1], [1]] });

        sharpTypes.push({ name: "", color: "#5ACB87", data: [[1, 1], [1, 0]] });
        sharpTypes.push({ name: "", color: "#5ACB87", data: [[1, 0], [1, 1]] });

        sharpTypes.push({ name: "", color: "#EF974A", data: [[1], [1], [1]] });
        sharpTypes.push({ name: "", color: "#EF974A", data: [[1, 1, 1]] });

        sharpTypes.push({ name: "", color: "#E76885", data: [[1], [1], [1], [1]] });
        sharpTypes.push({ name: "", color: "#E76885", data: [[1, 1, 1, 1]] });

        sharpTypes.push({ name: "", color: "#95DB52", data: [[1, 1], [1, 1]] });

        sharpTypes.push({ name: "", color: "#5ABFE3", data: [[1, 1, 1], [1, 0, 0], [1, 0, 0]] });
        sharpTypes.push({ name: "", color: "#5ABFE3", data: [[1, 1, 1], [0, 0, 1], [0, 0, 1]] });
        sharpTypes.push({ name: "", color: "#5ABFE3", data: [[1, 0, 0], [1, 0, 0], [1, 1, 1]] });
        sharpTypes.push({ name: "", color: "#5ABFE3", data: [[0, 0, 1], [0, 0, 1], [1, 1, 1]] });

        sharpTypes.push({ name: "", color: "#DD6454", data: [[1, 1, 1, 1, 1]] });
        sharpTypes.push({ name: "", color: "#DD6454", data: [[1], [1], [1], [1], [1]] });

        sharpTypes.push({ name: "", color: "#4AD3AD", data: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] });
        return sharpTypes;
    })();
    function Block(type, color) {
        base(this, LSprite, []);
        var self = this;
        self.setView(type);
        self.scaleX = self.scaleY = 0.5;

        //self.addEventListener(LMouseEvent.MOUSE_DOWN, function (e) {
        //    if (self.state == 3) { return false; }
        //    _con_x = e.offsetX;
        //    _con_y = e.offsetY;
        //    self.x = e.offsetX - self.width / 2;
        //    self.y = e.offsetY - self.height / 2 - self.height;
        //    self.state = 2;
        //    activeBlock = self;
        //    LTweenLite.to(self, 0.08, { scaleX: 1, scaleY: 1 });
        //});
        //self.addEventListener(LMouseEvent.MOUSE_DOWN, function ondown(e) {
        //    e.clickTarget.startDrag(e.touchPointID);
        //});
        //self.addEventListener(LMouseEvent.MOUSE_UP, function onup(e) {
        //    e.clickTarget.stopDrag();
        //});
    }
    Block.prototype.position = {}
    Block.prototype.color = null;
    Block.prototype.state = 1;//1：预备状态,2:拖动状态,3:已填充状态
    Block.prototype.blockData = [];
    Block.prototype.width = 0;
    Block.prototype.height = 0;
    Block.prototype.cony = 0;
    Block.prototype.setView = function (type) {
        var self = this;
        var blockData = this.blockData = sharpStorage[type].data;
        self.color = sharpStorage[type].color || "#7C8FD5";
        self.rotateCenter = false;
        for (var i = 0; i < blockData.length; i++) {
            var _y = 55 * i;
            for (var j = 0; j < blockData[i].length; j++) {
                var _x = 55 * j;
                var item = blockData[i][j];
                if (item == 1) {
                    var shape = new LShape();
                    shape.graphics.drawRoundRect(0, "#ff0000", [_x, _y, 52, 52, 8], true, self.color);
                    self.addChild(shape);
                    //self.addChild(createSprite({ image: "fk_de_2", x: _x, y: _y }));
                }
                //else {
                //    var shape = new LShape();
                //    shape.graphics.drawRoundRect(0, "#ff0000", [_x, _y, 52, 52, 8], true, "transparent");
                //    self.addChild(shape);
                //}
            }
        }
        self.width = self.getWidth();
        self.height = self.getHeight();
        self.cony = (100 + self.height);
    }
    function Number(num, scale, sharpType) {
        base(this, LSprite, []);
        var self = this;
        self.sharpType = sharpType || "1";
        self.value = num;
        self.scale = scale || 1;
        self.setView(num);
    }
    Number.prototype.value = 0;
    Number.prototype.changeSpeed = 0.1;
    Number.prototype.defaultlength = 0;
    Number.prototype.spacing = 0;//数字间隔
    Number.prototype.scale = 1;//放大倍数
    Number.prototype.sharpType = "1";//数字图形类别
    Number.prototype.singleWidth = 0;
    Number.prototype.setView = function (num) {
        var self = this;
        var digit = (num + "").split("");
        var spriteWrap = new LSprite();
        spriteWrap.x = 0;
        for (var i = 0; i < digit.length; i++) {
            var sprite = new LSprite();
            var num = parseInt(digit[i]);
            sprite.addChild(new LBitmap(new LBitmapData(imglist["number" + self.sharpType + "_" + num])));
            sprite.scaleX = sprite.scaleY = self.scale;
            spriteWrap.y = sprite.getHeight() / 2;
            sprite.y = -sprite.getHeight() / 2;
            sprite.x = self.singleWidth = spriteWrap.getWidth() + self.spacing;//i * (sprite.width * self.scale + self.spacing);
            spriteWrap.addChild(sprite);
            self.addChild(spriteWrap);
            //self.scaleY = 0.3;
        }
    }
    Number.prototype.setNumber = function (num, callBack) {
        var self = this;
        self.value = num;
        if (self.defaultlength != 0) {
            var _t = parseInt(num);
            var returnValue = "";
            var ss = self.defaultlength - (_t + "").length;
            for (var i = 0; i < ss; i++) { returnValue += "0"; }
            returnValue += _t;
            num = returnValue;
        }
        var spriteWrap = self.getChildAt(0);
        LTweenLite.to(spriteWrap, self.changeSpeed, {
            scaleY: 0, onComplete: function () {
                self.removeAllChild();
                self.setView(num);
                spriteWrap = self.getChildAt(0);
                spriteWrap.scaleY = 0;
                LTweenLite.to(spriteWrap, self.changeSpeed, {
                    scaleY: 1, onComplete: function () {
                        if (callBack) callBack.call(self);
                    }
                });
            }
        });
    }

    //init(7, "canvas", 640, 960, function () { main(); });
    if (LGlobal.ios) {
        LInit(15, "canvas", 640, 960, main, LEvent.INIT);
    } else {
        LInit(30, "canvas", 640, 960, main, LEvent.INIT);
    }

})(window);