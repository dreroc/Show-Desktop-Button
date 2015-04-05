
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Util = imports.misc.util;
const Panel = imports.ui.panel;

let text, indicatorBox, button;


function _showDesktop() {
        this._alreadyMinimizedWindows = [];
        if (Main.overview.visible)
        Main.overview.hide();
        let metaWorkspace = global.screen.get_active_workspace();
        let windows = metaWorkspace.list_windows();
        
        if (this._desktopShown) {
            for ( let i = 0; i < windows.length; ++i ) {
                if (windows[i].minimized){                   
                    let shouldrestore = true;
                    for (let j = 0; j < this._alreadyMinimizedWindows.length; j++) {
                        if (windows[i] == this._alreadyMinimizedWindows[j]) {
                            shouldrestore = false;
                            break;
                        }                        
                    }    
                    if (shouldrestore) {
                        windows[i].unminimize();                                  
                    }
                }
            }
            this._alreadyMinimizedWindows.length = []; //Apparently this is better than this._alreadyMinimizedWindows = [];
        }
        else {
            for ( let i = 0; i < windows.length; ++i ) {
                if (!windows[i].skip_taskbar){                   
                    if (!windows[i].minimized) {
                        windows[i].minimize();
                    }
                    else {
                        this._alreadyMinimizedWindows.push(windows[i]);
                    }                    
                }
            }
        }
        this._desktopShown = !this._desktopShown;
}

function init(extensionMeta) {
    let theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path(extensionMeta.path + "/icons");
    let scaleFactor = St.ThemeContext.get_for_stage(global.stage).scale_factor;

    indicatorBox = new St.BoxLayout();
    let icon = new St.Icon({
//        icon_name: 'my-show-desktop-hover-symbolic',
//        let iconSize = Panel.PANEL_ICON_SIZE * scaleFactor,
//        icon_size: iconSize,
        style_class: 'system-status-icon' //original
    });
//    icon.add_style_class_name('system-status-icon');
    button = new St.Bin({
//        style_class: 'panel-button',  //original
        child: icon,
        style_class: 'desktop',
        reactive: true,
        can_focus: true,
        x_fill: true,
        y_fill: false,
        y_align: St.Align.START,
        track_hover: true
    });
    button.add_style_class_name('panel-button');

    button.connect('button-press-event', _showDesktop);
    indicatorBox.add(button);


//    indicatorBox.add_style_class_name('panel-status-button');
//    button.set_child(icon);
//    button.connect('button-press-event', _showDesktop);
}

function enable() {
    let appMenu = Main.panel.statusArea.appMenu.actor.get_parent();
    Main.panel._leftBox.insert_child_below(indicatorBox, appMenu);
}

function disable() {
    Main.panel._leftBox.remove_child(indicatorBox);
}

