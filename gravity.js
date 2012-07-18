var delta = [ 0, 0 ];
var stage = [ window.screenX, window.screenY, window.innerWidth, window.innerHeight ];
getBrowserDimensions();

var isRunning = false;
var isMouseDown = false;

var world;
var iterations = 1;
var timeStep = 1 / 25; 

var walls = [];
var wall_thickness = 200;	// 厚さ
var wallsSetted = false;

var mouseJoint;
var mouseX = 0;
var mouseY = 0;

var mouseOnClick = [];

var elements = [];
var bodies = [];
var properties = [];

var query, page = 0;

var gWebSearch, gImageSearch;
var imFeelingLuckyMode = false;
var resultBodies = [];

var orientation = { x: 0, y: 1 };

function getBrowserDimensions() {
	var changed = false;
	
	// ブラウザを動かすと中身も揺れる
	if (stage[0] != window.screenX) {
		delta[0] = (window.screenX - stage[0]) * 50;
		stage[0] = window.screenX;
		changed = true;
	}

	if (stage[1] != window.screenY) {
		delta[1] = (window.screenY - stage[1]) * 50;
		stage[1] = window.screenY;
		changed = true;
	}
	
	
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	
	
	if (stage[2] != window.innerWidth + scrollX) {
		stage[2] = window.innerWidth + scrollX;
		changed = true;
	}

	if (stage[3] != window.innerHeight + scrollY) {
		stage[3] = window.innerHeight + scrollY;
		changed = true;
	}
	
	return changed;
}

//window.onload = function() {
	// init EventListener
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	// document.ondblclick = onDocumentDoubleClick;

	document.addEventListener( 'keyup', onDocumentKeyUp, false );


	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	document.addEventListener( 'touchend', onDocumentTouchEnd, false );

	window.addEventListener( 'deviceorientation', onWindowDeviceOrientation, false );

	// init box2d
	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set(-200, -200);
	
	var worldMaxX = Math.max(screen.width + 200, document.width + 200);
	var worldMaxY = Math.max(screen.height + 200, document.height + 200);
	worldAABB.maxVertex.Set(worldMaxX, worldMaxY);
	
	var gravity = new b2Vec2(0, 0);	// 重力ベクトル
	var doSleep = true;				// 動きが止まった物体の計算を省略するかどうか
	world = new b2World(worldAABB, gravity, doSleep);
	
	// walls
	setWalls();

	// Get box2d elements
	elements = document.getElementsByTagName("img");
	
	for (var i = 0; i < elements.length; i ++) {
		properties[i] = getElementProperties(elements[i]);
	}
	
	for ( var i = 0; i < elements.length; i ++ ) {
		var element = elements[i];
		element.style.position = 'absolute';
		element.style.left = properties[i][0] + 'px';
		element.style.top = properties[i][1] + 'px';
		element.style.width = properties[i][2] + 'px';
		element.addEventListener( 'mousedown', onElementMouseDown, false );
		element.addEventListener( 'mouseup', onElementMouseUp, false );
		element.addEventListener( 'click', onElementClick, false );

		bodies[i] = createBox( world, properties[i][0] + (properties[i][2] >> 1), properties[i][1] + (properties[i][3] >> 1), properties[i][2] / 2, properties[i][3] / 2, false );

		// Clean position dependencies
		while ( element.offsetParent ) {
			element = element.offsetParent;
			element.style.position = 'static';
		}
	}
	run();
//}

/*
 * ブラウザ枠部分に該当する壁を作る
 */
function setWalls() {
	if (wallsSetted) {
		world.DestroyBody(walls[0]);
		world.DestroyBody(walls[1]);
		world.DestroyBody(walls[2]);
		world.DestroyBody(walls[3]);

		walls[0] = null; 
		walls[1] = null;
		walls[2] = null;
		walls[3] = null;
	}
	
	walls[0] = createBox(world, stage[2] / 2, - wall_thickness, stage[2], wall_thickness);
	walls[1] = createBox(world, stage[2] / 2, stage[3] + wall_thickness, stage[2], wall_thickness);
	walls[2] = createBox(world, - wall_thickness, stage[3] / 2, wall_thickness, stage[3]);
	walls[3] = createBox(world, stage[2] + wall_thickness, stage[3] / 2, wall_thickness, stage[3]);	

	wallsSetted = true;
}

/**
 * Elementの位置情報を取得する
 */
function getElementProperties(element) {
	var x = 0;
	var y = 0;
	var width = element.offsetWidth;
	var height = element.offsetHeight;
	do {
		x += element.offsetLeft;
		y += element.offsetTop;
	} while ( element = element.offsetParent );
	return [ x, y, width, height ];
}

/**
 * 物体を作成する
 */
function createBox(world, x, y, width, height, fixed, element) {
	if (typeof(fixed) == 'undefined') {
		fixed = true;
	}

	var boxSd = new b2BoxDef();
	if (!fixed) {
		boxSd.density = 1.0;
	}

	boxSd.extents.Set(width, height);

	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);
	boxBd.userData = {element: element};
	return world.CreateBody(boxBd);
}

/**
 * 実行
 */
function run() {
	isRunning = true;
	setInterval(loop, 25);
}

/**
 * 繰り返し処理
 */
function loop() {
	if (getBrowserDimensions()) {
		setWalls();
	}

	delta[0] += (0 - delta[0]) * .5;
	delta[1] += (0 - delta[1]) * .5;

	world.m_gravity.x = orientation.x * 350 + delta[0];
	world.m_gravity.y = orientation.y * 350 + delta[1];

	mouseDrag();

	world.Step(timeStep, iterations);

	for ( i = 0; i < elements.length; i++ ) {
		var body = bodies[i];
		var element = elements[i];

		element.style.left = (body.m_position0.x - (properties[i][2] >> 1)) + 'px';
		element.style.top = (body.m_position0.y - (properties[i][3] >> 1)) + 'px';

		var style = 'rotate(' + (body.m_rotation0 * 57.2957795) + 'deg)';

		element.style.transform = style;
		element.style.WebkitTransform = style + ' translateZ(0)'; // Force HW Acceleration
		element.style.MozTransform = style;
		element.style.OTransform = style;
	}
}


// Mouse Event


function onDocumentMouseDown(event) {
	console.log("MouseDown");
	// event.preventDefault();
	isMouseDown = true;
}

function onDocumentMouseUp(event) {
	// event.preventDefault();
	isMouseDown = false;
}

function onDocumentMouseMove(event) {
	if ( !isRunning ) {
		run();
	}
	mouseX = event.clientX;
	mouseY = event.clientY;
}

function onDocumentKeyUp(event) {
	if ( event.keyCode == 13 ) {
		search();
	}
}

function onDocumentTouchStart(event) {
	if (event.touches.length == 1) {
		event.preventDefault();
		if ( !isRunning ) {
			run();
		}
		mouseX = event.touches[0].pageX;
		mouseY = event.touches[0].pageY;
		isMouseDown = true;
	}
}

function onDocumentTouchMove(event) {
	if (event.touches.length == 1) {
		event.preventDefault();
		mouseX = event.touches[0].pageX;
		mouseY = event.touches[0].pageY;
	}
}

function onDocumentTouchEnd(event) {
	if (event.touches.length == 0) {
		event.preventDefault();
		isMouseDown = false;
	}

}

function onWindowDeviceOrientation(event) {
	if (event.beta) {
		orientation.x = Math.sin(event.gamma * Math.PI / 180);
		orientation.y = Math.sin((Math.PI / 4) + event.beta * Math.PI / 180);
	}
}

function onElementMouseDown(event) {
	event.preventDefault();
	mouseOnClick[0] = event.clientX;
	mouseOnClick[1] = event.clientY;
}

function onElementMouseUp(event) {
	event.preventDefault();
}

function onElementClick(event) {
        console.log("ElementClick");
	var range = 5;
	if (mouseOnClick[0] > event.clientX + range || mouseOnClick[0] < event.clientX - range &&
	     mouseOnClick[1] > event.clientY + range || mouseOnClick[1] < event.clientY - range) {
		console.log("ElementClick default");
                event.preventDefault();
	}
}

function mouseDrag() {
	console.log("mouseDrag");
        // mouse press
	if (isMouseDown && !mouseJoint) {
		var body = getBodyAtMouse();
		if (body) {
			var md = new b2MouseJointDef();
			md.body1 = world.m_groundBody;
			md.body2 = body;
			md.target.Set(mouseX, mouseY);
			md.maxForce = 30000.0 * body.m_mass;
			md.timeStep = timeStep;
			mouseJoint = world.CreateJoint(md);
			body.WakeUp();
		}
	}

	// mouse release
	if (!isMouseDown) {
		if (mouseJoint) {
			world.DestroyJoint(mouseJoint);
			mouseJoint = null;
		}
	}

	// mouse move
	if (mouseJoint) {
		var p2 = new b2Vec2(mouseX, mouseY);
		mouseJoint.SetTarget(p2);
	}
}

function getBodyAtMouse() {
	// Make a small box.
	var mousePVec = new b2Vec2();
	mousePVec.Set(mouseX, mouseY);

	var aabb = new b2AABB();
	aabb.minVertex.Set(mouseX - 1, mouseY - 1);
	aabb.maxVertex.Set(mouseX + 1, mouseY + 1);

	// Query the world for overlapping shapes.
	var k_maxCount = 10;
	var shapes = [];
	var count = world.Query(aabb, shapes, k_maxCount);
	var body = null;

	for ( var i = 0; i < count; i ++ ) {
		if (shapes[i].m_body.IsStatic() == false) {
			if ( shapes[i].TestPoint(mousePVec) ) {
				body = shapes[i].m_body;
				break;
			}
		}
	}
	return body;
}
