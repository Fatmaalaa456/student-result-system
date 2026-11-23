class Student {
    #name;
    #grade1;
    #grade2;
    #grade3;
    #attendance;

    constructor(name, grade1, grade2, grade3, attendance) {
        this.name = name;
        this.grade1 = grade1;
        this.grade2 = grade2;
        this.grade3 = grade3;
        this.attendance = attendance;
    }

    set name(value) {
        if (!value || value.trim() === "") {
            throw new Error("من فضلك أدخل اسم الطالب.");
        }
        this.#name = value.trim();
    }

    get name() {
        return this.#name;
    }

    #checkScore(value, label) {
        if (value === "" || value === null || isNaN(value)) {
            throw new Error('حقل ${label} مطلوب ولا يمكن تركه فارغاً.');
        }
        const num = Number(value);
        if (num < 0 || num > 100) {
            throw new Error('قيمة ${label} يجب أن تكون بين 0 و 100.');
        }
        return num;
    }

    set grade1(value) {
        this.#grade1 = this.#checkScore(value, "الدرجة الأولى");
    }

    get grade1() {
        return this.#grade1;
    }

    set grade2(value) {
        this.#grade2 = this.#checkScore(value, "الدرجة الثانية");
    }

    get grade2() {
        return this.#grade2;
    }

    set grade3(value) {
        this.#grade3 = this.#checkScore(value, "الدرجة الثالثة");
    }

    get grade3() {
        return this.#grade3;
    }

    set attendance(value) {
        this.#attendance = this.#checkScore(value, "نسبة الحضور");
    }

    get attendance() {
        return this.#attendance;
    }

    getAverage() {
        return (this.#grade1 + this.#grade2 + this.#grade3) / 3;
    }
}

const studentsList = [];

const studentNameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");

const addStudentBtn = document.getElementById("addStudentBtn");
const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");
const studentsListBox = document.getElementById("studentsListBox");
const reportBox = document.getElementById("reportBox");

function renderStudents() {
    studentsListBox.innerHTML = "";

    studentsList.forEach((student) => {
        studentsListBox.innerHTML +=
            `<div class="list-group-item d-flex justify-content-between align-items-center">
                <span>${student.name}</span>
                <span class="badge bg-primary">المتوسط: ${student.getAverage().toFixed(2)}</span>
            </div>`;
    });
}

addStudentBtn.onclick = function () {
    errorBox.classList.add("d-none");
    errorBox.textContent = "";

    try {
        const student = new Student(
            studentNameInput.value,
            grade1Input.value,
            grade2Input.value,
            grade3Input.value,
            attendanceInput.value
        );
        studentsList.push(student);
        renderStudents();

        studentNameInput.value = "";
        grade1Input.value = "";
        grade2Input.value = "";
        grade3Input.value = "";
        attendanceInput.value = "";
    } catch (error) {
        errorBox.textContent = error.message;
        errorBox.classList.remove("d-none");
    }
};

mercyBtn.onclick = function () {
    const strugglingStudents = studentsList.filter((student) => {
        const avg = student.getAverage();
        return avg >= 40 && avg <= 49;
    });

    if (strugglingStudents.length === 0) {
        reportBox.innerHTML =
            `<div class="alert alert-info mt-3">
                <strong>تقرير لجنة الرأفة:</strong> لا يوجد طلاب متعثرون (متوسطهم بين 40 و 49).
            </div>`;
        return;
    }

    const updatedAverages = strugglingStudents.map((student) => student.getAverage() + 5);
const totalAfterMercy = updatedAverages.reduce((sum, avg) => sum + avg, 0);
    const generalAvg = (totalAfterMercy / strugglingStudents.length).toFixed(2);
    const names = strugglingStudents.map((student) => student.name).join(" ، ");

    reportBox.innerHTML =
        `<div class="card border-warning mt-3">
            <div class="card-header bg-warning fw-bold">التقرير النهائي للجنة الرأفة</div>
            <div class="card-body">
                <p><strong>عدد الطلاب المتعثرين:</strong> ${strugglingStudents.length}</p>
                <p><strong>أسماء الطلاب:</strong> ${names}</p>
                <p class="mb-0"><strong>المتوسط العام بعد الرأفة:</strong> ${generalAvg}</p>
            </div>
        </div>`;
};