#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![tauri_plugin_sql::Migration {
        version: 1,
        description: "create_tasks",
        sql: include_str!("../migrations/0001_tasks.sql"),
        kind: tauri_plugin_sql::MigrationKind::Up,
    }];
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite:lemon-tree.db", migrations).build())
        .run(tauri::generate_context!())
        .expect("failed to run Lemon Tree");
}
