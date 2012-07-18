// エンジンを初期化
var worldAABB = new b2AABB();			// 物理計算が行われる範囲
worldAABB.minVertex.Set(-1000, -1000);
worldAABB.maxVertex.Set(1000, 1000);
var gravity = new b2Vec2(0, 300);	// 重力ベクトル
var doSleep = true;								// 動きが止まった物体の計算を省略するかどうか
var world = new b2World(worldAABB, gravity, doSleep);

// 固定点
var circleSd = new b2CircleDef();
circleSd.radius = 10.0;
var circleBd1 = new b2BodyDef();
circleBd1.AddShape(circleSd);
circleBd1.position.Set(20, 50);
var circle1 = world.CreateBody(circleBd1);

// 落下点
circleSd.density = 1.0;
var circleBd2 = new b2BodyDef();
circleBd2.AddShape(circleSd);
circleBd2.position.Set(50, 50);
var circle2 = world.CreateBody(circleBd2);

// ジョイント
var jd = new b2PrismaticJointDef();
jd.body1 = circle1;
jd.body2 = circle2;
jd.anchorPoint = circle1.GetCenterPosition();
jd.axis.Set(1.0, 1.0);

jd.lowerTranslation = 500;	// 距離の下限
jd.upperTranslation = 600;	// 距離の上限
jd.enableLimit = true;			// 上限、下限の設定を有効にする

var joint = world.CreateJoint(jd);

// 地面用に固定された四角をエンジンに追加
var groundSd = new b2BoxDef();
groundSd.extents.Set(2000, 50);
groundSd.restitution = 0.2;
groundSd.localRotation = 0.1;
var groundBd = new b2BodyDef();
groundBd.AddShape(groundSd);
groundBd.position.Set(-500, 400);
var ground = world.CreateBody(groundBd);
