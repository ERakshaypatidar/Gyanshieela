package com.example;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.sql.*;
import java.util.*;

public class OLDBOOKSENDSERVLET extends HttpServlet {

private static final String DB_URL = "jdbc:mysql://localhost:3306/Gyanshila"; // Update with your DB URL
private static final String DB_USER = "root"; // Update with your DB username
private static final String DB_PASSWORD = ""; // Update with your DB password

@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
request.setCharacterEncoding("UTF-8");
response.setContentType("text/html;charset=UTF-8");

// Get 'id' from the request (URL parameter or form parameter)
String id = request.getParameter("id");

// Define list of expected parameters (fields expected from the form)
Set<String> expectedParams = new HashSet<>(Arrays.asList(
        "project_type", "project_id", "property_name", "property_name2", "property_no", "size",
        "floor_number", "amenities", "facing", "built_up_area", "super_built_up_area", "rate_per_sq_feet",
        "location", "ownership_type", "status", "purchase_date", "broker_name", "base_charges",
        "location_charges", "discount", "grand_total_amount", "price_of_unit", "payment_start_date",
        "payment_id", "total_amount_with_charge", "client_type", "individual_applicant_name",
        "individual_applicant_gender", "individual_applicant_age", "individual_applicant_email",
        "individual_applicant_contact_number", "individual_applicant_whatsapp_number",
        "individual_applicant_address", "individual_applicant_state", "individual_applicant_city",
        "individual_applicant_aadhar_number", "individual_applicant_pan_number",
        "individual_applicant_passport_number", "individual_applicant_gst_number",
        "company_name", "company_email", "company_contact_number", "company_whatsapp_number",
        "company_address", "company_applicant_name", "company_applicant_designation",
        "company_applicant_contact_number", "company_applicant_email",
        "company_applicant_aadhar_number", "company_applicant_passport_number",
        "company_applicant_pan_number", "mou_date", "parties_involved"
        ));

        // Map to store form data
        Map<String, String> formData = new HashMap<>();
                Enumeration<String> parameterNames = request.getParameterNames();

                    // Loop through all parameters and store them
                    while (parameterNames.hasMoreElements()) {
                    String paramName = parameterNames.nextElement();
                    String paramValue = request.getParameter(paramName);
                    if (paramValue == null || paramValue.isEmpty()) {
                    paramValue = "NULL"; // Default value for missing data, send "NULL" to insert as NULL
                    }

                    // Flatten nested parameter names (e.g. payments[0][schedule_name] -> payments_schedule_name)
                    String flattenedParamName = paramName.replaceAll("\\[\\d+\\]", "").replace("[", "_").replace("]",
                    "");
                    formData.put(flattenedParamName, paramValue);
                    }

                    // Database connection setup
                    Connection connection = null;
                    PreparedStatement preparedStatement = null;
                    try {
                    // Establishing the database connection
                    Class.forName("com.mysql.cj.jdbc.Driver");
                    connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);

                    String sql;

                    if (id != null && !id.isEmpty()) {
                    // If 'id' is provided, update the existing record
                    sql = buildUpdateSQL(expectedParams);
                    preparedStatement = connection.prepareStatement(sql);
                    setPreparedStatementParams(preparedStatement, formData, expectedParams);
                    preparedStatement.setString(expectedParams.size() + 1, id); // Set the 'id' as the last parameter
                    for WHERE clause
                    } else {
                    // If 'id' is not provided, insert a new record
                    sql = buildInsertSQL(expectedParams);
                    preparedStatement = connection.prepareStatement(sql);
                    setPreparedStatementParams(preparedStatement, formData, expectedParams);
                    }

                    // Execute the query
                    int result = preparedStatement.executeUpdate();
                    if (result > 0) {
                    response.getWriter().println("<br>Data " + (id != null ? "updated" : "inserted") + "
                    successfully!<br>");
                    } else {
                    response.getWriter().println("<br>Failed to " + (id != null ? "update" : "insert") + " data.<br>");
                    }

                    } catch (Exception e) {
                    e.printStackTrace();
                    response.getWriter().println("<br>Error: " + e.getMessage() + "<br>");
                    } finally {
                    // Close all resources
                    try {
                    if (preparedStatement != null) preparedStatement.close();
                    if (connection != null) connection.close();
                    } catch (SQLException se) {
                    se.printStackTrace();
                    }
                    }
                    }

                    // Method to build the SQL query for inserting data
                    private String buildInsertSQL(Set<String> expectedParams) {
                        StringBuilder sql = new StringBuilder("INSERT INTO bookingwithapplicant (");
                        for (String column : expectedParams) {
                        sql.append(column).append(", ");
                        }
                        sql.setLength(sql.length() - 2); // Remove last comma
                        sql.append(") VALUES (");
                        for (int i = 0; i < expectedParams.size(); i++) { sql.append("?, ");
        }
        sql.setLength(sql.length() - 2); // Remove last comma
            sql.append(" );");
            return sql.toString();
        }
    
        // Method to build the SQL query for updating data
        private String buildUpdateSQL(Set<String> expectedParams) {
                            StringBuilder sql = new StringBuilder("UPDATE bookingwithapplicant SET ");
                            for (String column : expectedParams) {
                            sql.append(column).append(" = ?, ");
                            }
                            sql.setLength(sql.length() - 2); // Remove last comma
                            sql.append(" WHERE id = ?;"); // Ensure only the specified 'id' is updated
                            return sql.toString();
                            }

                            // Method to set prepared statement parameters
                            private void setPreparedStatementParams(PreparedStatement preparedStatement, Map<String,
                                String> formData, Set<String> expectedParams) throws SQLException {
                                    int index = 1;
                                    for (String column : expectedParams) {
                                    String paramValue = formData.getOrDefault(column, "NULL");
                                    preparedStatement.setString(index++, paramValue.equals("NULL") ? null : paramValue);
                                    // For form data
                                    }
                                    }
                                    }
    // Method to print all request parameters (for debugging)

                                        }