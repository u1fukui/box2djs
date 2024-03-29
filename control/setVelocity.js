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

// 地面用に固定された四角をエンジンに追加
var groundSd = new b2BoxDef();
groundSd.extents.Set(2000, 50);
groundSd.restitution = 0.2;
var groundBd = new b2BodyDef();
groundBd.AddShape(groundSd);
groundBd.position.Set(-500, 500);
var ground = world.CreateBody(groundBd);

// 3秒後に速度を設定
setTimeout(function() {
  box.WakeUp();
  box.SetLinearVelocity(new b2Vec2(118, 0));
}, 3000);

// 3秒後に角速度を設定
setTimeout(function() {
  box.WakeUp();
  box.SetAngularVelocity(-20);
}, 6000);
