insert into departments
    (departmentId, departmentName, departmentManager)
values
    (1, "Accounting", "Angela Martin"),
    (2, "Human Resources", "Toby Flenderson"),
    (3, "Customer Service", "Kelly Kapoor"),
    (4, "Sales", "Michael Scott"),
    (5, "Warehouse", "Darryl Philbin");

insert into roles
    (roleId, title, salary, departmentId)
values
    (1, "Senior Accountant", 65000, 1),
    (2, "Accountant", 60000, 1),
    (3, "HR Manager", 50000, 2),
    (4, "Customer Service Coordinator", 40000, 3),
    (5, "Regional Manager", 90000, 4),
    (6, "Assistant to the Regional Manager", 80000, 4),
    (7, "Sales Representative", 70000, 4),
    (8, "Warehouse Foreman", 95000, 5),
    (9, "Dock Worker", 45000, 5);

insert into employees
    (firstName, lastName, roleId, managerId)
values
    ("Angela", "Martin", 1,1),
    ("Oscar", "Martinez", 2, 1),
    ("Kevin", "Malone", 2, 1),
    ("Toby", "Flenderson", 3, 2),
    ("Kelly", "Kapoor", 4, 3),
    ("Michael", "Scott", 5, 4),
    ("Dwight", "Schrute", 6, 2),
    ("Stanley", "Hudson", 7, 4),
    ("Phyllis", "Vance", 7, 4),
    ("Jim", "Halpert", 7, 4),
    ("Darryl", "Philbin", 8, 5),
    ("Roy", "Anderson", 9, 5);