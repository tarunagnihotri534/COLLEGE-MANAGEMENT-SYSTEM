/*
 * College Management System - C Implementation
 * Fixed and Optimized Version
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Global variable to keep track of number of students
int student_count = 0;
#define MAX_STUDENTS 55

struct Course {
    int cid;
};

struct Student {
    char fname[50];
    char lname[50];
    int roll;
    float cgpa;
    int cids[5]; // Storing 5 course IDs
} students[MAX_STUDENTS];

// Function prototypes
void add_student();
void find_by_roll();
void find_by_fname();
void find_by_course();
void total_students();
void delete_student();
void update_student();

void add_student() {
    if (student_count >= MAX_STUDENTS) {
        printf("Error: Maximum student limit reached.\n");
        return;
    }

    printf("\n=== Add Student Details ===\n");
    printf("Enter First Name: ");
    scanf("%s", students[student_count].fname);
    printf("Enter Last Name: ");
    scanf("%s", students[student_count].lname);
    
    // Check for unique roll number
    int new_roll;
    int is_unique = 1;
    do {
        is_unique = 1;
        printf("Enter Roll Number: ");
        scanf("%d", &new_roll);
        for(int k=0; k<student_count; k++) {
            if(students[k].roll == new_roll) {
                printf("Error: Roll number already exists. Try again.\n");
                is_unique = 0;
                break;
            }
        }
    } while(!is_unique);
    
    students[student_count].roll = new_roll;

    printf("Enter CGPA: ");
    scanf("%f", &students[student_count].cgpa);

    printf("Enter 5 Course IDs:\n");
    for (int j = 0; j < 5; j++) {
        printf("Course %d ID: ", j+1);
        scanf("%d", &students[student_count].cids[j]);
    }

    student_count++;
    printf("Student added successfully.\n");
}

void find_by_roll() {
    int roll;
    printf("\nEnter Roll Number to search: ");
    scanf("%d", &roll);

    int found = 0;
    for (int j = 0; j < student_count; j++) {
        if (students[j].roll == roll) {
            printf("\n--- Student Found ---\n");
            printf("First Name: %s\n", students[j].fname);
            printf("Last Name: %s\n", students[j].lname);
            printf("CGPA: %.2f\n", students[j].cgpa);
            printf("Courses: ");
            for (int k = 0; k < 5; k++) {
                printf("%d ", students[j].cids[k]);
            }
            printf("\n");
            found = 1;
            break;
        }
    }
    if (!found) {
        printf("Student with Roll Number %d not found.\n", roll);
    }
}

void find_by_fname() {
    char name[50];
    printf("\nEnter First Name to search: ");
    scanf("%s", name);

    int found = 0;
    for (int j = 0; j < student_count; j++) {
        if (strcmp(students[j].fname, name) == 0) {
            printf("\n--- Student Found ---\n");
            printf("Roll Number: %d\n", students[j].roll);
            printf("First Name: %s\n", students[j].fname);
            printf("Last Name: %s\n", students[j].lname);
            printf("CGPA: %.2f\n", students[j].cgpa);
            found = 1;
        }
    }
    if (!found) {
        printf("No students found with First Name '%s'.\n", name);
    }
}

void find_by_course() {
    int cid;
    printf("\nEnter Course ID to search: ");
    scanf("%d", &cid);

    int found = 0;
    for (int j = 0; j < student_count; j++) {
        for (int d = 0; d < 5; d++) {
            if (students[j].cids[d] == cid) {
                printf("\n--- Student Enrolled ---\n");
                printf("Name: %s %s (Roll: %d)\n", students[j].fname, students[j].lname, students[j].roll);
                found = 1;
                break; // Found the course for this student, move to next student
            }
        }
    }
    if (!found) {
        printf("No students found enrolled in Course ID %d.\n", cid);
    }
}

void total_students() {
    printf("\nTotal Students: %d\n", student_count);
    printf("Slots Remaining: %d\n", MAX_STUDENTS - student_count);
}

void delete_student() {
    int roll;
    printf("\nEnter Roll Number to delete: ");
    scanf("%d", &roll);

    int found = 0;
    for (int j = 0; j < student_count; j++) {
        if (students[j].roll == roll) {
            // Shift elements left
            for (int k = j; k < student_count - 1; k++) {
                students[k] = students[k + 1];
            }
            student_count--;
            found = 1;
            printf("Student with Roll Number %d deleted successfully.\n", roll);
            break;
        }
    }
    if (!found) {
        printf("Student with Roll Number %d not found.\n", roll);
    }
}

void update_student() {
    int roll;
    printf("\nEnter Roll Number to update: ");
    scanf("%d", &roll);

    for (int j = 0; j < student_count; j++) {
        if (students[j].roll == roll) {
            printf("\nUpdate choices:\n");
            printf("1. First Name\n");
            printf("2. Last Name\n");
            printf("3. Roll Number\n");
            printf("4. CGPA\n");
            printf("5. Courses\n");
            printf("Enter choice: ");
            
            int choice;
            scanf("%d", &choice);
            
            switch (choice) {
                case 1:
                    printf("Enter new First Name: ");
                    scanf("%s", students[j].fname);
                    break;
                case 2:
                    printf("Enter new Last Name: ");
                    scanf("%s", students[j].lname);
                    break;
                case 3:
                     // Ideally check uniqueness again, but for simplicity:
                    printf("Enter new Roll Number: ");
                    scanf("%d", &students[j].roll);
                    break;
                case 4:
                    printf("Enter new CGPA: ");
                    scanf("%f", &students[j].cgpa);
                    break;
                case 5:
                    printf("Enter 5 new Course IDs: ");
                    for(int k=0; k<5; k++) scanf("%d", &students[j].cids[k]);
                    break;
                default:
                    printf("Invalid choice.\n");
            }
            printf("Student updated successfully.\n");
            return;
        }
    }
    printf("Student check with Roll Number %d not found.\n", roll);
}

int main() {
    int choice;
    while (1) {
        printf("\n=== College Management System ===\n");
        printf("1. Add Student\n");
        printf("2. Find by Roll Number\n");
        printf("3. Find by First Name\n");
        printf("4. Find by Course ID\n");
        printf("5. Total Student Count\n");
        printf("6. Delete Student\n");
        printf("7. Update Student\n");
        printf("8. Exit\n");
        printf("Enter your choice: ");
        
        if (scanf("%d", &choice) != 1) {
             // Handle non-integer input to prevent infinite loops
             while(getchar() != '\n'); 
             continue;
        }

        switch (choice) {
            case 1: add_student(); break;
            case 2: find_by_roll(); break;
            case 3: find_by_fname(); break;
            case 4: find_by_course(); break;
            case 5: total_students(); break;
            case 6: delete_student(); break;
            case 7: update_student(); break;
            case 8: 
                printf("Exiting... Thank you.\n");
                exit(0);
            default:
                printf("Invalid choice. Please try again.\n");
        }
    }
    return 0;
}
