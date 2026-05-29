
export class InputManager {

    constructor() {

        this.keys = {};

        this.mouse = {

            left: false,
            middle: false,
            right: false
        };

        this.touch = {

            active: false,

            x: 0,
            y: 0
        };

        this.gamepadIndex = null;

        this.events = {};

        this.isMobile =
            /Android|iPhone|iPad|iPod/i.test(
                navigator.userAgent
            );

        this.joystick = {

            active: false,

            x: 0,

            y: 0,

            dx: 0,

            dy: 0
        };
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.registerKeyboard();

        this.registerMouse();

        this.registerTouch();

        this.registerGamepad();

        this.createVirtualJoystick();

        return this;
    }

    /* =====================================================
       EVENT SYSTEM
    ===================================================== */

    on(eventName, callback) {

        if(!this.events[eventName]) {

            this.events[eventName] = [];
        }

        this.events[eventName]
            .push(callback);
    }

    emit(eventName, data = null) {

        if(
            !this.events[eventName]
        )
            return;

        this.events[eventName]
            .forEach(callback => {

                callback(data);
            });
    }

    /* =====================================================
       KEYBOARD
    ===================================================== */

    registerKeyboard() {

        window.addEventListener(
            "keydown",
            e => {

                this.keys[e.code] = true;

                this.emit(
                    "keydown",
                    e.code
                );

                if(
                    e.code === "Escape"
                ) {

                    this.emit(
                        "pause"
                    );
                }
            }
        );

        window.addEventListener(
            "keyup",
            e => {

                this.keys[e.code] = false;

                this.emit(
                    "keyup",
                    e.code
                );
            }
        );
    }

    /* =====================================================
       MOUSE
    ===================================================== */

    registerMouse() {

        window.addEventListener(
            "mousedown",
            e => {

                switch(e.button) {

                    case 0:
                        this.mouse.left = true;
                        break;

                    case 1:
                        this.mouse.middle = true;
                        break;

                    case 2:
                        this.mouse.right = true;
                        break;
                }

                this.emit(
                    "mousedown",
                    e.button
                );
            }
        );

        window.addEventListener(
            "mouseup",
            e => {

                switch(e.button) {

                    case 0:
                        this.mouse.left = false;
                        break;

                    case 1:
                        this.mouse.middle = false;
                        break;

                    case 2:
                        this.mouse.right = false;
                        break;
                }

                this.emit(
                    "mouseup",
                    e.button
                );
            }
        );
    }

    /* =====================================================
       TOUCH
    ===================================================== */

    registerTouch() {

        window.addEventListener(
            "touchstart",
            e => {

                this.touch.active =
                    true;

                this.touch.x =
                    e.touches[0].clientX;

                this.touch.y =
                    e.touches[0].clientY;

                this.emit(
                    "touchstart"
                );
            },
            { passive: true }
        );

        window.addEventListener(
            "touchmove",
            e => {

                this.touch.x =
                    e.touches[0].clientX;

                this.touch.y =
                    e.touches[0].clientY;

                this.emit(
                    "touchmove"
                );
            },
            { passive: true }
        );

        window.addEventListener(
            "touchend",
            () => {

                this.touch.active =
                    false;

                this.emit(
                    "touchend"
                );
            }
        );
    }

    /* =====================================================
       GAMEPAD
    ===================================================== */

    registerGamepad() {

        window.addEventListener(
            "gamepadconnected",
            e => {

                this.gamepadIndex =
                    e.gamepad.index;

                console.log(
                    "Gamepad Connected"
                );
            }
        );

        window.addEventListener(
            "gamepaddisconnected",
            () => {

                this.gamepadIndex =
                    null;
            }
        );
    }

    updateGamepad() {

        if(
            this.gamepadIndex === null
        )
            return;

        const pad =
            navigator.getGamepads()[
                this.gamepadIndex
            ];

        if(!pad)
            return;

        const lx =
            pad.axes[0];

        const ly =
            pad.axes[1];

        this.emit(
            "gamepadMove",
            {
                x: lx,
                y: ly
            }
        );

        if(
            pad.buttons[0].pressed
        ) {

            this.emit(
                "jump"
            );
        }

        if(
            pad.buttons[7].pressed
        ) {

            this.emit(
                "capture"
            );
        }
    }

    /* =====================================================
       MOBILE JOYSTICK
    ===================================================== */

    createVirtualJoystick() {

        if(
            !this.isMobile
        )
            return;

        const base =
            document.createElement(
                "div"
            );

        base.id =
            "virtualJoystick";

        base.style.cssText =

        `
        position:fixed;
        left:20px;
        bottom:100px;

        width:120px;
        height:120px;

        border-radius:50%;

        background:
        rgba(255,255,255,.12);

        z-index:9999;

        touch-action:none;
        `;

        const knob =
            document.createElement(
                "div"
            );

        knob.id =
            "virtualKnob";

        knob.style.cssText =

        `
        position:absolute;

        left:35px;
        top:35px;

        width:50px;
        height:50px;

        border-radius:50%;

        background:
        rgba(255,255,255,.35);
        `;

        base.appendChild(
            knob
        );

        document.body.appendChild(
            base
        );

        this.setupJoystick(
            base,
            knob
        );
    }

    setupJoystick(
        base,
        knob
    ) {

        const radius = 40;

        const reset = () => {

            knob.style.left = "35px";
            knob.style.top = "35px";

            this.joystick.dx = 0;
            this.joystick.dy = 0;

            this.joystick.active =
                false;
        };

        base.addEventListener(
            "touchstart",
            e => {

                this.joystick.active =
                    true;

                e.preventDefault();
            }
        );

        base.addEventListener(
            "touchmove",
            e => {

                const rect =
                    base.getBoundingClientRect();

                const touch =
                    e.touches[0];

                let x =
                    touch.clientX -
                    rect.left -
                    60;

                let y =
                    touch.clientY -
                    rect.top -
                    60;

                const distance =
                    Math.hypot(x,y);

                if(
                    distance > radius
                ) {

                    x =
                        x /
                        distance *
                        radius;

                    y =
                        y /
                        distance *
                        radius;
                }

                knob.style.left =
                    `${35 + x}px`;

                knob.style.top =
                    `${35 + y}px`;

                this.joystick.dx =
                    x / radius;

                this.joystick.dy =
                    y / radius;

                this.emit(
                    "joystickMove",
                    {
                        x:
                        this.joystick.dx,

                        y:
                        this.joystick.dy
                    }
                );

                e.preventDefault();

            },
            { passive:false }
        );

        base.addEventListener(
            "touchend",
            reset
        );
    }

    /* =====================================================
       HELPERS
    ===================================================== */

    isKeyPressed(code) {

        return !!this.keys[code];
    }

    isMouseDown(button) {

        switch(button) {

            case 0:
                return this.mouse.left;

            case 1:
                return this.mouse.middle;

            case 2:
                return this.mouse.right;
        }

        return false;
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    update() {

        this.updateGamepad();
    }
}

