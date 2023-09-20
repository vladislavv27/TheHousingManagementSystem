# The Housing Management System
 The Housing Management System is a client-side web application developed using Angular and Bootstrap 5. It allows users to manage housing-related data, including houses, apartments, and residents. The application provides role-based access control, supporting two user roles: Manager and Resident.

**Note:** The data for this application is fetched from a [.NET REST API](https://github.com/vladislavv27/Rest-api) that provides the necessary endpoints for managing housing-related information.

## **Features**
* **User Roles: The system supports two user roles:**

  * Manager: Managers can perform CRUD operations on houses, apartments, and residents.
  * Resident: Residents have limited access and can only view their associated house, apartment, and update their own information.
* **House Management:**

  * Create, read, update, and delete houses.
  * View a list of all houses.
* **Apartment Management:**

  * Create, read, update, and delete apartments.
  * View a list of all apartments in a house.
* **Resident Management:**

  * Create, read, and update resident information.
  * Managers can associate residents with apartments.
* **Residents** can update their own information.
* **Authentication:** Implemented OAuth 2.0 authentication for secure login.
* In the application, we have implemented a simple city filter that allows users to quickly find houses in a specific city. Simply enter the name of the city in the filter field, and the application will display only those houses located in the specified city.
* We also provide a convenient select element that automatically loads data.


![image](https://github.com/vladislavv27/ApartmentManager/assets/77066719/c02c22f4-f743-4684-b2c7-62db89cb3d7b)
## Technologies Used
  * Angular
  * Bootstrap 5
  * OAuth 2.0
  * Angular project template with ASP.NET Core
  * Azure dev
  * .NET Rest API
## Screenshots
![image](https://github.com/vladislavv27/ApartmentManager/assets/77066719/ebefbada-ec27-482d-99c8-c8a425437bb1)
![image](https://github.com/vladislavv27/ApartmentManager/assets/77066719/149cb7aa-6229-4110-829d-ec113d7fcd4b)
