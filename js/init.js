Event.observe(window, 'load', function(e) {
	// 表示用コンテキストを取得
	var context = $$('canvas')[0].getContext('2d');

	// エンジンのプロパティ
	var timeStep = 1.0 / 60;
	var iteration = 1;

	// アニメーションを実行
	// (10ms毎に画面を書き換える）
	setInterval(function() {
		// 表示をクリア
		context.clearRect(0, 0, 500, 500);
		// 物体を次の位置へ移動
		world.Step(timeStep, iteration);
		// 物体を表示
		drawWorld(world, context);
	}, 10);
});