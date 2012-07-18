// エンジンを初期化
var worldAABB = new b2AABB();			// 物理計算が行われる範囲
worldAABB.minVertex.Set(-1000, -1000);
worldAABB.maxVertex.Set(1000, 1000);
var gravity = new b2Vec2(0, 300);	// 重力ベクトル
var doSleep = true;								// 動きが止まった物体の計算を省略するかどうか
var world = new b2World(worldAABB, gravity, doSleep);

// 物体を作成
var boxSd = new b2BoxDef();
boxSd.density = 1.0;
boxSd.extents.Set(30, 30);
var boxBd = new b2BodyDef();
boxBd.AddShape(boxSd);
boxBd.position.Set(250, 200);
var box = world.CreateBody(boxBd);

// ジョイントを作成
var jd = new b2RevoluteJointDef();
jd.body1 = world.GetGroundBody();
jd.body2 = box;
jd.anchorPoint = box.GetCenterPosition();
jd.enableMotor = true;
jd.motorTorque = 100000000;
jd.motorSpeed = 1;
var joint = world.CreateJoint(jd);
