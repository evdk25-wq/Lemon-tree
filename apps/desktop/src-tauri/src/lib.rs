#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        tauri_plugin_sql::Migration {
            version: 1,
            description: "create_tasks",
            sql: include_str!("../migrations/0001_tasks.sql"),
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        tauri_plugin_sql::Migration {
            version: 2,
            description: "add_task_due_date",
            sql: include_str!("../migrations/0002_task_due_date.sql"),
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        tauri_plugin_sql::Migration {
            version: 3,
            description: "create_messages",
            sql: include_str!("../migrations/0003_messages.sql"),
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        tauri_plugin_sql::Migration {
            version: 4,
            description: "add_message_channels",
            sql: include_str!("../migrations/0004_message_channels.sql"),
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        tauri_plugin_sql::Migration {
            version: 5,
            description: "create_channels",
            sql: include_str!("../migrations/0005_channels.sql"),
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        tauri_plugin_sql::Migration {
            version: 6,
            description: "add_message_mentions",
            sql: include_str!("../migrations/0006_message_mentions.sql"),
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        tauri_plugin_sql::Migration {
            version: 7,
            description: "create_mention_notifications",
            sql: include_str!("../migrations/0007_mention_notifications.sql"),
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        tauri_plugin_sql::Migration {
            version: 8,
            description: "create_decisions",
            sql: include_str!("../migrations/0008_decisions.sql"),
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        tauri_plugin_sql::Migration {
            version: 9,
            description: "add_message_attachments",
            sql: include_str!("../migrations/0009_message_attachments.sql"),
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        tauri_plugin_sql::Migration {
            version: 10,
            description: "create_teams",
            sql: include_str!("../migrations/0010_teams.sql"),
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
    ];
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite:lemon-tree.db", migrations).build())
        .run(tauri::generate_context!())
        .expect("failed to run Lemon Tree");
}
