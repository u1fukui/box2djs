// エンジンを初期化
var worldAABB = new b2AABB();			// 物理計算が行われる範囲
worldAABB.minVertex.Set(-1000, -1000);
worldAABB.maxVertex.Set(1000, 1000);
var gravity = new b2Vec2(0, 300);	// 重力ベクトル
var doSleep = true;								// 動きが止まった物体の計算を省略するかどうか
var world = new b2World(worldAABB, gravity, doSleep);

// 図形を定義してエンジンに追加
var position = new b2Vec2(250, 350);

// 左円
var circleSd1 = new b2CircleDef();
circleSd1.density = 1;
circleSd1.radius = 100;

// 右円
var circleSd2 = new b2CircleDef();
circleSd2.density = 1;
circleSd2.radius = circleSd1.radius;
circleSd2.localPosition.Set(circleSd1.radius * 2, 0);

// 物体を作成
var bd = new b2BodyDef();
bd.AddShape(circleSd1);
bd.AddShape(circleSd2);
bd.position = position;
var circles = world.CreateBody(bd);

// 地面用に固定された四角をエンジンに追加
var groundSd = new b2BoxDef();
groundSd.extents.Set(2000, 50);
groundSd.restitution = 0.2;
var groundBd = new b2BodyDef();
groundBd.AddShape(groundSd);
groundBd.position.Set(-500, 500);
var ground = world.CreateBody(groundBd);


circles.SetOriginPosition(position, 0);
setTimeout(function() {
	circles.SetCenterPosition(position, 0);
}, 3000);