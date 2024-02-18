// ubuntu

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Child, Command}; // Windows 전용 확장 기능을 위한 트레잇
use std::sync::{Arc, Mutex};

use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}
// const CREATE_NO_WINDOW: u32 = 0x08000000;

#[tauri::command]
fn get_username() -> String {
    whoami::username()
}

fn main() {
    ///////////////////////////////////////////////////////////
    // FastAPI 서버를 관리하기 위한 Arc<Mutex> 구조체
    let server = Arc::new(Mutex::new(None));
    ///////////////////////////////////////////////////////////

    let open = CustomMenuItem::new("open".to_string(), "열기");
    let quit = CustomMenuItem::new("quit".to_string(), "끝내기");
    let tray_menu = SystemTrayMenu::new()
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(open)
        .add_item(quit);

    tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_username])
        .setup({
            let server = Arc::clone(&server); // `server` 변수의 클론을 생성합니다.

            move |app| {
                let server_clone = Arc::clone(&server); // `start-server` 클로저용 클론

                let app_data_dir = app.path_resolver().app_data_dir().unwrap(); // AppData 경로를 얻습니다.
               
                println!("{}", app_data_dir.display());
                let server_exe_path = app_data_dir.join("extensions").join("server"); // 실행할 파일의 경로를 설정합니다.

                let start = app.listen_global("start-server", move |event| {
                    println!("스타트 서버 {:?}", event.payload());

                    let server_exe_path_clone = server_exe_path.clone(); // `server_exe_path`의 클론을 생성합니다.

                    let mut server_clone = server_clone.lock().unwrap(); // Mutex 잠금을 획득합니다.
                    *server_clone = Some(
                        Command::new(server_exe_path_clone)
                            // .creation_flags(CREATE_NO_WINDOW) // 창 없이 프로세스 생성
                            .spawn()
                            .expect("failed to start FastAPI server"),
                    );
                });

                Ok(())
            }
        })
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);

            app.emit_all("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        .system_tray(SystemTray::new().with_menu(tray_menu))
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
            
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "open" => {
                        let window = app.get_window("main").unwrap();
                        let _ = window.show();
                        let _ = window.unminimize();
                        let _ = window.set_focus();
                    }         
                    
                    "quit" => {
                        std::process::exit(0); // 종료
                    }
                    _ => {}
                }
            }
            _ => {}


        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

