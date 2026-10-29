//! Where the menubar (tray) window pops up: a port of getTrayPosX / getTrayPosY in
//! stemn-frontend-desktop/app/main/createMenuBarWindow.js. The window is placed next to the
//! cursor (which is on the tray icon when the tray is clicked), kept inside the work area.

pub const WINDOW_WIDTH: f64 = 330.0;
pub const WINDOW_HEIGHT: f64 = 450.0;
const HORIZ_PADDING: f64 = 15.0;
const VERT_PADDING: f64 = 30.0;

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Size {
    pub width: f64,
    pub height: f64,
}

/// Top-left corner (logical pixels) of the menubar window for a cursor position and the size of
/// the work area of the display the cursor is on.
pub fn menubar_position(cursor: Point, work_area: Size) -> (i32, i32) {
    let vert_bottom = cursor.y >= work_area.height / 2.0;
    let horiz_right = cursor.x >= work_area.width / 2.0;

    let left = cursor.x - WINDOW_WIDTH / 2.0;
    let right = cursor.x + WINDOW_WIDTH / 2.0;
    let x = if !horiz_right {
        if left <= HORIZ_PADDING {
            HORIZ_PADDING
        } else {
            left
        }
    } else if right >= work_area.width {
        work_area.width - HORIZ_PADDING - WINDOW_WIDTH
    } else {
        right - WINDOW_WIDTH
    };
    let y = if vert_bottom {
        cursor.y - WINDOW_HEIGHT - VERT_PADDING
    } else {
        cursor.y + VERT_PADDING
    };
    (x.round().max(0.0) as i32, y.round().max(0.0) as i32)
}

#[cfg(test)]
mod tests {
    use super::*;

    const SCREEN: Size = Size { width: 1920.0, height: 1080.0 };

    #[test]
    fn top_right_tray_like_gnome_or_macos() {
        // cursor on a tray icon in the top bar, near the right edge
        assert_eq!(menubar_position(Point { x: 1800.0, y: 10.0 }, SCREEN), (1575, 40));
    }

    #[test]
    fn bottom_right_tray_like_windows() {
        // 1900 + 165 overflows: clamp to the right padding
        assert_eq!(menubar_position(Point { x: 1900.0, y: 1070.0 }, SCREEN), (1575, 590));
        // centred under the cursor when it fits
        assert_eq!(menubar_position(Point { x: 1200.0, y: 1070.0 }, SCREEN), (1035, 590));
    }

    #[test]
    fn left_side_is_clamped_to_the_padding() {
        assert_eq!(menubar_position(Point { x: 20.0, y: 5.0 }, SCREEN), (15, 35));
        assert_eq!(menubar_position(Point { x: 400.0, y: 5.0 }, SCREEN), (235, 35));
    }

    #[test]
    fn never_negative() {
        let tiny = Size { width: 200.0, height: 300.0 };
        let (x, y) = menubar_position(Point { x: 150.0, y: 200.0 }, tiny);
        assert!(x >= 0 && y >= 0);
    }
}
