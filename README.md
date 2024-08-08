# race-game-library
A simple JavaScript library for creating racing games.


```
npm run build
```

```
http-server . -a your-ip-address -p 7888
```

一、引入方式
只需要在你的HTML文件中引入这个JS库：
<script src="race-game-library.js path"></script>

<!--办公室局域网-->
<script src="http://192.168.31.114:7888/dist/race-game-library.js"></script>
暂时无法在飞书文档外展示此内容

二、快速开始
1. 创建游戏容器
在HTML文件中创建一个容器元素，用于渲染游戏画面：
<div id="gameContainer" style="width: 100%; height: 100vh;"></div>
2. 初始化游戏
初始化游戏并添加赛车和赛道：
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('gameContainer');
        const config = {
            playerSpeed: 0.1,  // 调整赛车速度
            enemySpeed: 0.1,   // 调整敌人速度
            maxCrashes: 3      // 设置游戏结束前允许的最大撞击次数
        };
        const game = new RaceGameLibrary.Game(container, config);
        const car = new RaceGameLibrary.Car(0xff0000); // 创建红色赛车 0xff0000:Red
        const track = new RaceGameLibrary.Track();     // 创建赛道

        game.addCar(car);    // 将赛车添加到游戏中
        game.addTrack(track); // 将赛道添加到游戏中
    });
</script>

三、API文档
1. Game
Game 类用于管理游戏的主要逻辑，包括初始化场景、处理动画循环和响应用户输入。
构造函数：
new RaceGameLibrary.Game(container, config)
container：HTML元素，游戏将渲染到这个元素中。
config：配置对象，用于设置游戏参数。
- playerSpeed：赛车移动速度（默认值：0.3）。
- enemySpeed：敌人移动速度（默认值：0.15）。
- maxCrashes：允许的最大撞击次数（默认值：5）。
函数方法：
- addCar(car)：将赛车添加到游戏中。
  - car：一个 Car 类的实例。
- addTrack(track)：将赛道添加到游戏中。
  - track：一个 Track 类的实例。
- loadSkybox(skyboxPath)：将你的天空盒文件添加到游戏中
  - skyboxPath：你的天空盒文件路径

2. Car
Car 类用于创建赛车对象。
构造函数：
new RaceGameLibrary.Car(color)
- color：赛车的颜色（十六进制颜色值，如 0xff0000 表示红色）。
函数方法：
- moveForward(distance)：移动赛车。
  - distance：移动距离（正值向前，负值向后）。
- turn(angle)：转动车辆。
  - angle：转动的角度（弧度，正值向右转，负值向左转）。
  
3. Track
Track 类用于创建赛道对象。
构造函数：
new RaceGameLibrary.Track()
函数方法：
- moveBackward(distance)：使赛道向后移动，模拟赛车前进的效果。
  - distance：移动距离。

四、示例
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Racing Game</title>
    <style>
        body {
            margin: 0;
        }

        canvas {
            display: block;
        }

        #ui {
            position: absolute;
            top: 10px;
            left: 10px;
            color: white;
            font-family: sans-serif;
        }

        .game-over {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-family: sans-serif;
            font-size: 24px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div id="ui">Score: 0, Crashes: 0</div>
    <div id="game-over" class="game-over" style="display: none;">
        Game Over! <br>
        Your Score: <span id="final-score">0</span> <br>
        <button id="restart-button">Restart</button>
    </div>
    <div id="gameContainer" style="width: 100%; height: 100vh;"></div>
    <script src="http://192.168.31.114:7888/dist/race-game-library.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('gameContainer');
            const config = {
                playerSpeed: 0.1,
                enemySpeed: 0.1,
                maxCrashes: 3
            };
            const game = new RaceGameLibrary.Game(container, config);
            const car = new RaceGameLibrary.Car(0xffffff);
            const track = new RaceGameLibrary.Track();
            game.addCar(car);
            game.addTrack(track);

            // 加载天空盒
            const skyboxPath = 'http://192.168.31.114:7888/skybox/skybox3.hdr';
            game.loadSkybox(skyboxPath);
        });

        document.getElementById("restart-button").addEventListener("click", () => {
            location.reload();
        });
    </script>
</body>

</html>
[图片]
