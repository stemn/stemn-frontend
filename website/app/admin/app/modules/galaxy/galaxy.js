angular.module('modules.galaxy', []);
angular.module('modules.galaxy').


directive('galaxy', function (CoreService) {
    return {
        restrict: 'E',
        template: '<canvas id="canv" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 0"></canvas>',
        link: function (scope, element, attrs) {
            var c = document.getElementById('canv');
            var $ = c.getContext('2d');
            var w = c.width = window.innerWidth;
            var h = c.height = window.innerHeight;

            window.addEventListener('resize', function () {
                c.width = w = window.innerWidth;
                c.height = h = window.innerHeight;
            }, false);

            var num = w * h / 810;
            var arr = [];
            var i = 0;

            while (arr.length < num) {
                arr.push({
                    x: (Math.random() * w) | 0,
                    y: (Math.random() * h) | 0,
                    vx: 0,
                    vy: 0
                });
            }

            function _X(foo) {
                return Math.sin(foo.y / 45) / 0.3;
            }

            function _Y(foo) {
                return Math.sin(foo.x / 45) / 0.3;
            }

            function upd(bar) {
                var n = arr[i];
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0) {
                    n.x = w + n.x;
                } else if (n.x >= w) {
                    n.x -= w;
                }

                if (n.y < 0) {
                    n.y = h + n.y;
                } else if (n.y >= h) {
                    n.y -= h;
                }

                n.vy = _Y(n);
                n.vx = _X(n);
            }

            function draw(bar) {
                var n = arr[i];
                var col = 'hsla(' + i + ',90%, 60%, 1)';
                //outer rings
                $.beginPath();
                $.fillStyle = col;
                $.globalAlpha = .1;
                $.arc(n.x, n.y, 15 / Math.max((n.vx * n.vx + n.vy * n.vy), 0.5), 0, 2 * Math.PI, 0);
                $.closePath();
                $.fill();
                //inner rings
                $.beginPath();
                $.globalAlpha = 1;
                $.fillStyle = col;
                $.arc(n.x, n.y, 8 / Math.max((n.vx * n.vx + n.vy * n.vy), 0.8), 0, 2 * Math.PI, 0);
                $.closePath();
                $.fill();
            }

            function go() {
                $.fillStyle = 'hsla(0,0%,0%,1)';
                $.fillRect(0, 0, w, h);
                for (i = 0; i < num; i++) {
                    upd(i);
                    draw(i);
                }
            };

            run();

            function run() {
                window.requestAnimationFrame(run);
                go();
            }

        }

    };
});
