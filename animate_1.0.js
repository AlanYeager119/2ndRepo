function animate(elem, targetJSON, time, tweenString, callback) {
    //参数处理
    if (arguments.length < 3 || typeof arguments[0] != "object" || typeof arguments[1] != "object" || typeof arguments[2] != "number") {
        throw new Error("对不起，你传进来的参数数量不对或者参数类型不对，请仔细检查哦！");
        return;
    } else if (arguments.length == 3) {
        tweenString = "Linear";
        callback = null;
    } else if (arguments.length == 4) {
        switch (typeof arguments[3]) {
            case "string":
                callback = null;
                break;
            case "function":
                callback = arguments[3];
                tweenString = "Linear";
                break;
            default:
                throw new Error("抱歉，第4个参数要么是缓冲描述词，要么是回调函数，请检查！");
        }
    } else if(arguments.length == 5){
        if(typeof arguments[3] !== "string"){
            throw new Error("抱歉，第4个参数必须是缓冲描述词，请检查！");
        }else{
            if(typeof arguments[4] !== "function"){
                throw new Error("抱歉，第5个参数必须是回调函数，请检查！");
            }
        }
    }



    // 定时器最小时间间隔设定
    if (window.navigator.userAgent.indexOf("MSIE") != -1) {
        var interval = 50;
    } else {
        var interval = 10;
    }


    // 元素是否在运动的标志
    elem.isAnimated = true;

    // 存放元素初始状态的样式信息
    var originalJSON = {};

    // 存放整个运动的样式变化量信息
    var deltaJSON = {};

    // 构建三个JSON信息：初始状态的样式信息    运动结束(目标)状态样式信息    整个运动的样式变化量信息
    for (var k in targetJSON) {
        originalJSON[k] = parseFloat(fetchComputedStyle(elem, k));
        targetJSON[k] = parseFloat(targetJSON[k]);
        deltaJSON[k] = targetJSON[k] - originalJSON[k];
    }

    // 最大运动次数（帧数）
    var maxFrameNumber = time / interval;

    // 当前执行次数的计数器
    var frameNumber = 0;

    // 暂存每一次调用缓冲以后的样式信息数值
    var tempVal;

    // 计时开始运动
    var timer = setInterval(function () {
        // 每一个要改变的样式都按照缓冲改变
        for (var k in originalJSON) {
            tempVal = Tween()[tweenString](frameNumber, originalJSON[k], deltaJSON[k], maxFrameNumber);
            if (k != "opacity") {
                elem.style[k] = tempVal + "px";
            } else {
                elem.style[k] = tempVal;
                elem.style.filter = "alpha(opacity=" + tempVal * 100 + ")";
            }
        }

        // 改变一次以后，帧数+1
        frameNumber++;
        
        // 如果运动次数（当前帧数）和总次数（应当运动的总帧数）一致时，表示运动结束，需要把没有到达最终状态的强行改变成最终状态
        // 然后停止计时器，并且改变元素正在运动的标志为false
        if (frameNumber == maxFrameNumber) {
            for (var k in targetJSON) {
                if (k != "opacity") {
                    elem.style[k] = targetJSON[k] + "px";
                } else {
                    elem.style[k] = targetJSON[k];
                    elem.style.filter = "alpha(opacity=" + (targetJSON[k] * 100) + ")";
                }
            }
            clearInterval(timer);
            elem.isAnimated = false;
            // 运动完成后会自动调用回调函数，并且改变回调函数中的this指向
            callback && callback.apply(elem);
        }
    }, interval);
}


function Tween(){
    var Tween = {
        Linear: function (t, b, c, d) {
            return c * t / d + b;
        },
        //二次的
        QuadEaseIn: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        QuadEaseOut: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        QuadEaseInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        //三次的
        CubicEaseIn: function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        CubicEaseOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        CubicEaseInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        //四次的
        QuartEaseIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        QuartEaseOut: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        QuartEaseInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        QuintEaseIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        QuintEaseOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        QuintEaseInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        //正弦的
        SineEaseIn: function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        SineEaseOut: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        SineEaseInOut: function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        ExpoEaseIn: function (t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        ExpoEaseOut: function (t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        ExpoEaseInOut: function (t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        CircEaseIn: function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        CircEaseOut: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        CircEaseInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        ElasticEaseIn: function (t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        ElasticEaseOut: function (t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        ElasticEaseInOut: function (t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        //冲过头系列
        BackEaseIn: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        BackEaseOut: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        BackEaseInOut: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        //弹跳系列
        BounceEaseIn: function (t, b, c, d) {
            return c - this.BounceEaseOut(d - t, 0, c, d) + b;
        },
        BounceEaseOut: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        BounceEaseInOut: function (t, b, c, d) {
            if (t < d / 2) return this.BounceEaseIn(t * 2, 0, c, d) * .5 + b;
            else return this.BounceEaseOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    };
    return Tween;
}


function changeCSSPropToCamel(str) {
    return str.replace(/\-([a-z])/g, function ($m, $1) {
        return $1.toUpperCase();
    });
}

function changeCamelToCSSProp(str) {
    return str.replace(/[A-Z]/g, function ($m) {
        return "-" + $m.toLowerCase();
    });
}

function fetchComputedStyle(eleNode, cssProp) {
    if (window.getComputedStyle) {
        cssProp = changeCamelToCSSProp(cssProp);
        return getComputedStyle(eleNode)[cssProp];
    } else {
        cssProp = changeCSSPropToCamel(cssProp);
        if (cssProp == "opacity") {
            return 0 + eleNode.currentStyle[cssProp];
        } else {
            return eleNode.currentStyle[cssProp];
        }

    }
}