import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class DBConnection {
    private static final int MAX_POOL_SIZE = 10;
    private static final String DRIVER_CLASS = "com.mysql.cj.jdbc.Driver";
    private static final String URL = "jdbc:mysql://localhost:3306/just_glance_tuition?useSSL=false&serverTimezone=UTC";
    private static final String USERNAME = "your_mysql_username";  // Replace with your MySQL username
    private static final String PASSWORD = "your_mysql_password";  // Replace with your MySQL password
    
    private static BlockingQueue<Connection> connectionPool;
    private static DBConnection instance;
    
    private DBConnection() {
        try {
            Class.forName(DRIVER_CLASS);
            initializeConnectionPool();
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Failed to load JDBC driver.", e);
        }
    }
    
    public static synchronized DBConnection getInstance() {
        if (instance == null) {
            instance = new DBConnection();
        }
        return instance;
    }
    
    private void initializeConnectionPool() {
        connectionPool = new ArrayBlockingQueue<>(MAX_POOL_SIZE);
        for (int i = 0; i < MAX_POOL_SIZE; i++) {
            try {
                Connection connection = createNewConnection();
                connectionPool.offer(connection);
            } catch (SQLException e) {
                System.err.println("Error initializing connection pool: " + e.getMessage());
            }
        }
    }
    
    private Connection createNewConnection() throws SQLException {
        Properties props = new Properties();
        props.setProperty("user", "root");
        props.setProperty("password", "harsha@123");
        props.setProperty("autoReconnect", "true");
        props.setProperty("useSSL", "false");
        
        return DriverManager.getConnection(URL, props);
    }
    
    public Connection getConnection() throws SQLException {
        try {
            Connection connection = connectionPool.take();
            if (!isConnectionValid(connection)) {
                connection = createNewConnection();
            }
            return connection;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new SQLException("Interrupted while waiting for connection", e);
        }
    }
    
    public void releaseConnection(Connection connection) {
        if (connection != null) {
            try {
                if (!connection.isClosed() && isConnectionValid(connection)) {
                    connectionPool.offer(connection);
                } else {
                    createNewConnection(); // Replace invalid connection
                }
            } catch (SQLException e) {
                System.err.println("Error releasing connection: " + e.getMessage());
            }
        }
    }
    
    private boolean isConnectionValid(Connection connection) {
        try {
            return connection != null && !connection.isClosed() && connection.isValid(1);
        } catch (SQLException e) {
            return false;
        }
    }
    
    public void shutdown() {
        Connection connection;
        while ((connection = connectionPool.poll()) != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }
    
    // Example of how to use the database connection
    public static void demonstrateConnection() {
        DBConnection db = DBConnection.getInstance();
        Connection conn = null;
        try {
            conn = db.getConnection();
            // Use the connection here for database operations
            System.out.println("Connection successfully obtained!");
            
        } catch (SQLException e) {
            System.err.println("Error using connection: " + e.getMessage());
        } finally {
            if (conn != null) {
                db.releaseConnection(conn);
            }
        }
    }
    
    // Example usage method
    public static void main(String[] args) {
        DBConnection dbConnection = DBConnection.getInstance();
        try {
            Connection conn = dbConnection.getConnection();
            // Use the connection for database operations
            System.out.println("Successfully connected to database!");
            // Don't forget to release the connection when done
            dbConnection.releaseConnection(conn);
        } catch (SQLException e) {
            System.err.println("Database connection error: " + e.getMessage());
        } finally {
            // Shutdown the connection pool when application ends
            dbConnection.shutdown();
        }
    }
}