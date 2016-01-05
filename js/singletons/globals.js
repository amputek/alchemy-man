var b2World = Box2D.Dynamics.b2World;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RayCastInput = Box2D.Collision.b2RayCastInput;
var b2RayCastOutput = Box2D.Collision.b2RayCastOutput;
var b2Vec2 = Box2D.Common.Math.b2Vec2;
// var b2Transform = Box2D.Common.Math.b2Transform;

var SCALE = 8;
var world = null;

var game; //Game Manager
var images; //Image Manager
var sound; //Sound Manager
var debug; //Debug Manager

var inControl = true;

var debugging = false;

var editon = true;

var stats;

var zoom = 1.0;
var gamespeed = 1.0;

var levelManager;

var currentLevel;
var player;
var input;

var offset = vector(0,0)
var now = Date.now();



var editor;
