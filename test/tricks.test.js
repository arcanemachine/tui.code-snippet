/*eslint-disable*/
describe('tricks', function() {
    describe('debounce', function() {
        var spy;

        beforeEach(function() {
            spyOn(window, 'setTimeout');
            spy = jasmine.createSpy('debounced?');
        });

        it('test debounced functions.', function() {
            var fn;

            fn = tui.util.debounce(spy, 50);
            fn();

            expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 50);
            window.setTimeout.calls.argsFor(0)[0]();
            expect(spy).toHaveBeenCalled();
        });

        it('debounced function can accept parameters', function() {
            var fn;

            window.setTimeout.and.callFake(function(func) {
                func();
            });

            fn = tui.util.debounce(spy);
            fn('hello world!');

            expect(spy.calls.argsFor(0)).toEqual(['hello world!']);
        });
    });

    describe('throttle', function() {
        var spy;

        /**
         * util method for tui.util.timestamp spying.
         *
         * get an array and return each element at every invokes.
         */
        function reload(arr) {
            var i = 0,
                bullet;

            function fire() {
                bullet = arr[i];
                i += 1;
                return bullet;
            }

            return fire;
        }

        beforeEach(function() {
            spy = jasmine.createSpy('throttled?');
        });

        it('test throttled functions.', function() {
            var magazine = [1, 3, 6, 8, 9],
                fireGun = reload(magazine),
                fn;

            spyOn(tui.util, 'timestamp').and.callFake(function() {
                return fireGun();
            });

            spyOn(tui.util, 'debounce').and.returnValue(function() {});

            fn = tui.util.throttle(spy, 7);

            fn();
            fn();
            fn();
            fn();
            fn();

            expect(spy.calls.count()).toBe(2);
            expect(tui.util.debounce).toHaveBeenCalled();
        });

        it('debounced method must invoke with additional parameter', function() {
            var magazine = [1, 3, 6, 8, 9],
                fireGun = reload(magazine),
                fn;

            spyOn(tui.util, 'timestamp').and.callFake(function() {
                return fireGun();
            });

            var debounced = jasmine.createSpy('debounced');
            spyOn(tui.util, 'debounce').and.returnValue(debounced);

            fn = tui.util.throttle(spy, 7);

            fn('hello');
            fn('hello');
            fn('hello');
            fn('hello');
            fn('hello');

            expect(spy.calls.count()).toBe(2);
            expect(tui.util.debounce).toHaveBeenCalled();

            expect(debounced.calls.count()).toBe(4);
            // debounce가 이미 콜백을 apply 처리하고 있는데, Mock을 했기 때문에
            // args 를 그냥 넘겨준다 따라서 TC에서만은 각 debounce의 파라미터가 배열 형태임.
            expect(debounced.calls.allArgs()).toEqual([
                [['hello']],
                [['hello']],
                [['hello']],
                [['hello']]
            ]);
        });

        it('reset can remove slugs related with throttling.', function() {
            var magazine = [1, 3, 6, 8, 9],
                fireGun = reload(magazine),
                fn;

            spyOn(tui.util, 'timestamp').and.callFake(function() {
                return fireGun();
            });

            fn = tui.util.throttle(spy, 7);

            fn();

            expect(spy.calls.count()).toBe(1);

            fn.reset();
            fireGun = reload(magazine);

            fn();

            expect(spy.calls.count()).toBe(2);
        });

        it('throttled functions can accept parameters.', function() {
            var fn;

            fn = tui.util.throttle(spy);

            fn('hello world!');

            expect(spy.calls.argsFor(0)).toEqual(['hello world!']);
        });
    });
});
