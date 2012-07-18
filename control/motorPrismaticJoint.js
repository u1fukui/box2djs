// エンジンを初期化
var worldAABB = new b2AABB();			// 物理計算が行われる範囲
worldAABB.minVertex.Set(-1000, -1000);
worldAABB.maxVertex.Set(1000, 1000);
var gravity = new b2Vec2(0, 300);	// 重力ベクトル
var doSleep = true;								// 動きが止まった物体の計算を省略するかどうか
var world = new b2World(worldAABB, gravity, doSleep);

// 物体を作成
var anchorSd = new b2CircleDef();
anchorSd.radius = 10;
var anchorBd = new b2BodyDef();
anchorBd.AddShape(anchorSd);
anchorBd.position.Set(50, 50);
var anchor = world.CreateBody(anchorBd);

var boxSd = new b2BoxDef();
boxSd.density = 1.0;
boxSd.extents.Set(30, 30);
var boxBd = new b2BodyDef();
boxBd.AddShape(boxSd);
boxBd.position.Set(250, 250);
var box = world.CreateBody(boxBd);

// ジョイントを作成
var jd = new b2PrismaticJointDef();
jd.body1 = anchor;
jd.body2 = box;
jd.anchorPoint = anchor.GetCenterPosition();
jd.axis.Set(1, 1);
jd.enableMotor = true;
jd.motorForce = 10000000;
jd.motorSpeed = -100;

// ジョイントの動く範囲を制限
jd.enableLimit = true;
jd.lowerTranslation = -200;

var joint = world.CreateJoint(jd);