# CRunnerJS

> It is not a real compiler, it has more limitation.
---

###  1. **Variable Declaration and Usage**

```c
// variable_example.c
#include <stdio.h>

int main() {
    int age = 25;
    char letter = 'A';
    float num1 = 5.50;
    double num2 = 100.00;
    char str[10] = "Anisur";

    printf("Age: %d\n", age);
    printf("Grade: %c\n", letter);
    printf("Num1: %f\n", num1);
    printf("Num2: %lf\n", num2);
    printf("String: %s\n", str);

    return 0;
}
```

---

###  2. **Conditional Statements (if, else if, else)**

```c
// condition_example.c
#include <stdio.h>

int main() {
    int marks = 75;

    if (marks >= 90) {
        printf("Grade: A\n");
    } else if (marks >= 75) {
        printf("Grade: B\n");
    } else if (marks >= 60) {
        printf("Grade: C\n");
    } else {
        printf("Grade: F\n");
    }

    return 0;
}
```
###  3. **Switch Case Statement**

```c
// switch_case.c
#include <stdio.h>

int main() {
    int x = 2;

    switch (x) {
        case 1:
            printf("Case 1\n");
            break;
        case 2:
            printf("Case 2\n");
            break;
        default:
            printf("Default case\n");
    }

    return 0;
}
```

---

###  4. **Loops (for, while, do-while)**

```c
// loop_example.c
#include <stdio.h>

int main() {
    // For loop
    printf("For loop:\n");
    for (int i = 0; i < 3; i++) {
        printf("%d ", i);
    }

    // While loop
    printf("\n\nWhile loop:\n");
    int j = 0;
    while (j < 3) {
        printf("%d ", j);
        j++;
    }

    // Do-while loop
    printf("\n\nDo-while loop:\n");
    int k = 0;
    do {
        printf("%d ", k);
        k++;
    } while (k < 3);

    return 0;
}
```

---

###  5. **Array Example**

```c
// array_example.c
#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};

    printf("Array elements:\n");
    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);
    }

    return 0;
}
```

---

###  6. **String Example**

```c
// string_example.c
#include <stdio.h>
#include <string.h>

int main() {
    char str1[20] = "Hello";
    char str2[20] = "World";

    strcat(str1, " ");
    strcat(str1, str2);

    printf("Concatenated string: %s\n", str1);
    printf("Length: %d\n", strlen(str1));

    return 0;
}
```

---

###  7. **Factorial Function Only**
> Normal function does not work sometimes, it is progressing.

```c
// factorial_function.c
#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    printf("Factorial of 5 = %d\n", factorial(5));
    return 0;
}
```
> It is not real compiler, it has more limitation.


