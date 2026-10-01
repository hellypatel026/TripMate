import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import TravelBackground from "../../components/TravelBackground";
import "./Expenses.css";

function Expenses() {
    const { tripId } = useParams();
    const navigate = useNavigate();

    const logout = useAuthStore((state) => state.logout);

    const [trip, setTrip] = useState(null);
    const [members, setMembers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [expenseSummary, setExpenseSummary] = useState(null);
    const [settlements, setSettlements] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [editingExpenseId, setEditingExpenseId] = useState(null);

    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [participantValues, setParticipantValues] = useState({});

    const [expenseData, setExpenseData] = useState({
        title: "",
        amount: "",
        category: "food",
        splitType: "equal",
        paidBy: "",
        description: ""
    });

    const [showSettlementForm, setShowSettlementForm] = useState(false);

    const [settlementData, setSettlementData] = useState({
        from: "",
        to: "",
        amount: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    tripResponse,
                    memberResponse,
                    expenseResponse,
                    summaryResponse,
                    settlementResponse
                ] = await Promise.all([
                    api.get(`/trips/${tripId}`),
                    api.get(`/trip-members/${tripId}`),
                    api.get(`/expenses/${tripId}`),
                    api.get(`/expenses/${tripId}/summary`),
                    api.get(`/settlements/${tripId}`)
                ]);

                setTrip(tripResponse.data.trip);

                const fetchedMembers =
                    memberResponse.data.members;

                setMembers(fetchedMembers);

                setSelectedParticipants(
                    fetchedMembers.map(
                        (member) => member.user._id
                    )
                );

                setExpenses(
                    expenseResponse.data.expenses
                );

                setExpenseSummary(
                    summaryResponse.data
                );

                setSettlements(
                    settlementResponse.data.settlements
                );
            } catch (error) {
                console.error(
                    "Error loading expenses:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load expenses"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tripId]);

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    const refreshSummary = async () => {
        const response = await api.get(
            `/expenses/${tripId}/summary`
        );

        setExpenseSummary(response.data);
    };

    const handleExpenseChange = (e) => {
        setExpenseData({
            ...expenseData,
            [e.target.name]: e.target.value
        });
    };

    const handleParticipantChange = (userId) => {
        setSelectedParticipants((prev) => {
            if (prev.includes(userId)) {
                return prev.filter(
                    (id) => id !== userId
                );
            }

            return [...prev, userId];
        });
    };

    const handleParticipantValueChange = (
        userId,
        value
    ) => {
        setParticipantValues((prev) => ({
            ...prev,
            [userId]: value
        }));
    };

    const resetExpenseForm = () => {
        setExpenseData({
            title: "",
            amount: "",
            category: "food",
            splitType: "equal",
            paidBy: "",
            description: ""
        });

        setSelectedParticipants(
            members.map((member) => member.user._id)
        );

        setParticipantValues({});
        setEditingExpenseId(null);
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();

        try {
            let participants;

            if (selectedParticipants.length === 0) {
                alert(
                    "Please select at least one participant."
                );
                return;
            }

            if (expenseData.splitType === "equal") {
                participants =
                    selectedParticipants.map((userId) => ({
                        user: userId
                    }));
            } else if (
                expenseData.splitType === "exact"
            ) {
                participants =
                    selectedParticipants.map((userId) => ({
                        user: userId,
                        amount: Number(
                            participantValues[userId] || 0
                        )
                    }));
            } else {
                participants =
                    selectedParticipants.map((userId) => ({
                        user: userId,
                        percentage: Number(
                            participantValues[userId] || 0
                        )
                    }));
            }

            const response = await api.post(
                `/expenses/${tripId}`,
                {
                    ...expenseData,
                    amount: Number(expenseData.amount),
                    participants
                }
            );

            setExpenses((prev) => [
                ...prev,
                response.data.expense
            ]);

            await refreshSummary();

            resetExpenseForm();
            setShowExpenseForm(false);

            alert("Expense added successfully.");
        } catch (error) {
            console.error(
                "Error adding expense:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to add expense"
            );
        }
    };

    const handleEditExpense = async (
        id,
        updatedData
    ) => {
        try {
            const response = await api.put(
                `/expenses/${id}`,
                updatedData
            );

            setExpenses((prev) =>
                prev.map((expense) =>
                    expense._id === id
                        ? response.data.expense
                        : expense
                )
            );

            await refreshSummary();

            setEditingExpenseId(null);

            alert("Expense updated successfully.");
        } catch (error) {
            console.error(
                "Error updating expense:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update expense"
            );
        }
    };

    const handleDeleteExpense = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this expense?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/expenses/${id}`);

            setExpenses((prev) =>
                prev.filter(
                    (expense) => expense._id !== id
                )
            );

            await refreshSummary();

            alert("Expense deleted successfully.");
        } catch (error) {
            console.error(
                "Error deleting expense:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete expense"
            );
        }
    };

    const handleCreateSettlement = async () => {
        try {
            if (
                !settlementData.from ||
                !settlementData.to ||
                !settlementData.amount
            ) {
                alert(
                    "Please fill all settlement fields."
                );
                return;
            }

            if (
                settlementData.from ===
                settlementData.to
            ) {
                alert(
                    "Pay From and Pay To cannot be the same member."
                );
                return;
            }

            const response = await api.post(
                `/settlements/${tripId}`,
                {
                    from: settlementData.from,
                    to: settlementData.to,
                    amount: Number(
                        settlementData.amount
                    )
                }
            );

            setSettlements((prev) => [
                ...prev,
                response.data.settlement
            ]);

            setSettlementData({
                from: "",
                to: "",
                amount: ""
            });

            setShowSettlementForm(false);

            alert(
                "Settlement created successfully."
            );
        } catch (error) {
            console.error(
                "Error creating settlement:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to create settlement"
            );
        }
    };

    const handleMarkSettlementPaid = async (
        settlementId
    ) => {
        try {
            const response = await api.put(
                `/settlements/${settlementId}/paid`
            );

            setSettlements((prev) =>
                prev.map((settlement) =>
                    settlement._id === settlementId
                        ? response.data.settlement
                        : settlement
                )
            );

            alert(
                "Settlement marked as paid."
            );
        } catch (error) {
            console.error(
                "Error marking settlement:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to mark settlement as paid"
            );
        }
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getCategoryIcon = (category) => {
        const icons = {
            food: "🍴",
            hotel: "🏨",
            transport: "🚗",
            shopping: "🛍️",
            activity: "🎟️",
            other: "📦"
        };

        return icons[category] || "💰";
    };

    if (loading) {
        return (
            <div className="expenses-state">
                <div className="expenses-state-icon">
                    💰
                </div>

                <h2>Loading expenses...</h2>

                <p>
                    Getting the trip's spending
                    information ready.
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="expenses-state">
                <div className="expenses-state-icon">
                    !
                </div>

                <h2>Something went wrong</h2>

                <p>{error}</p>

                <Link
                    to={`/trips/${tripId}`}
                    className="expenses-state-button"
                >
                    ← Back to Trip
                </Link>
            </div>
        );
    }

    return (
        <div className="expenses-page">

            <TravelBackground />

            {/* =========================
                NAVBAR
            ========================= */}
            <header className="expenses-navbar">

                <Link
                    to="/"
                    className="expenses-brand"
                >
                    <span className="expenses-brand-icon">
                        ✈
                    </span>

                    <span>TripMate</span>
                </Link>

                <nav className="expenses-nav">

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/notifications">
                        Notifications
                    </Link>

                    <Link to="/profile">
                        Profile
                    </Link>

                    <button
                        className="expenses-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </nav>

            </header>

            <main className="expenses-main">

                {/* =========================
                    HEADER
                ========================= */}
                <Link
                    to={`/trips/${tripId}`}
                    className="expenses-back-link"
                >
                    ← Back to {trip?.name || "Trip"}
                </Link>

                <section className="expenses-header">

                    <div>
                        <p className="expenses-eyebrow">
                            TRIP FINANCES
                        </p>

                        <h1>
                            Expenses<span>.</span>
                        </h1>

                        <p className="expenses-subtitle">
                            Keep track of what everyone
                            spends and make settling up simple.
                        </p>
                    </div>

                    <button
                        className="add-expense-button"
                        onClick={() => {
                            if (showExpenseForm) {
                                resetExpenseForm();
                            }

                            setShowExpenseForm(
                                !showExpenseForm
                            );
                        }}
                    >
                        {showExpenseForm
                            ? "Cancel"
                            : "+ Add Expense"}
                    </button>

                </section>

                {/* =========================
                    SUMMARY CARDS
                ========================= */}
                <section className="expense-summary-grid">

                    <div className="expense-summary-card total-card">

                        <div className="summary-icon">
                            💰
                        </div>

                        <div>
                            <span>Total Spending</span>

                            <strong>
                                ₹
                                {expenseSummary?.totalExpense ||
                                    0}
                            </strong>
                        </div>

                    </div>

                    <div className="expense-summary-card">

                        <div className="summary-icon">
                            👥
                        </div>

                        <div>
                            <span>Members</span>

                            <strong>
                                {members.length}
                            </strong>
                        </div>

                    </div>

                    <div className="expense-summary-card">

                        <div className="summary-icon">
                            🧾
                        </div>

                        <div>
                            <span>Expenses</span>

                            <strong>
                                {expenses.length}
                            </strong>
                        </div>

                    </div>

                    <div className="expense-summary-card">

                        <div className="summary-icon">
                            🤝
                        </div>

                        <div>
                            <span>Settlements</span>

                            <strong>
                                {settlements.length}
                            </strong>
                        </div>

                    </div>

                </section>

                {/* =========================
                    ADD EXPENSE FORM
                ========================= */}
                {showExpenseForm && (
                    <section className="expense-form-card">

                        <div className="expense-form-heading">

                            <div>
                                <p className="expenses-section-label">
                                    NEW EXPENSE
                                </p>

                                <h2>
                                    Add a trip expense
                                </h2>

                                <p>
                                    Record who paid and how
                                    the cost should be split.
                                </p>
                            </div>

                        </div>

                        <form
                            className="expense-form"
                            onSubmit={handleAddExpense}
                        >

                            <div className="expense-form-group">
                                <label>
                                    Expense title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Dinner at the beach"
                                    value={expenseData.title}
                                    onChange={
                                        handleExpenseChange
                                    }
                                    required
                                />
                            </div>

                            <div className="expense-form-group">
                                <label>
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    value={expenseData.amount}
                                    onChange={
                                        handleExpenseChange
                                    }
                                    required
                                />
                            </div>

                            <div className="expense-form-group">
                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={
                                        expenseData.category
                                    }
                                    onChange={
                                        handleExpenseChange
                                    }
                                >
                                    <option value="food">
                                        Food
                                    </option>

                                    <option value="hotel">
                                        Hotel
                                    </option>

                                    <option value="transport">
                                        Transport
                                    </option>

                                    <option value="shopping">
                                        Shopping
                                    </option>

                                    <option value="activity">
                                        Activity
                                    </option>

                                    <option value="other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            <div className="expense-form-group">
                                <label>
                                    Paid by
                                </label>

                                <select
                                    name="paidBy"
                                    value={
                                        expenseData.paidBy
                                    }
                                    onChange={
                                        handleExpenseChange
                                    }
                                    required
                                >
                                    <option value="">
                                        Select member
                                    </option>

                                    {members.map(
                                        (member) => (
                                            <option
                                                key={
                                                    member.user
                                                        ._id
                                                }
                                                value={
                                                    member.user
                                                        ._id
                                                }
                                            >
                                                {
                                                    member.user
                                                        .name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="expense-form-group full-width">

                                <label>
                                    Split type
                                </label>

                                <div className="split-type-options">

                                    <label
                                        className={
                                            expenseData.splitType ===
                                            "equal"
                                                ? "split-option active"
                                                : "split-option"
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name="splitType"
                                            value="equal"
                                            checked={
                                                expenseData.splitType ===
                                                "equal"
                                            }
                                            onChange={
                                                handleExpenseChange
                                            }
                                        />

                                        <span>
                                            Equal
                                        </span>
                                    </label>

                                    <label
                                        className={
                                            expenseData.splitType ===
                                            "exact"
                                                ? "split-option active"
                                                : "split-option"
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name="splitType"
                                            value="exact"
                                            checked={
                                                expenseData.splitType ===
                                                "exact"
                                            }
                                            onChange={
                                                handleExpenseChange
                                            }
                                        />

                                        <span>
                                            Exact amount
                                        </span>
                                    </label>

                                    <label
                                        className={
                                            expenseData.splitType ===
                                            "percentage"
                                                ? "split-option active"
                                                : "split-option"
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name="splitType"
                                            value="percentage"
                                            checked={
                                                expenseData.splitType ===
                                                "percentage"
                                            }
                                            onChange={
                                                handleExpenseChange
                                            }
                                        />

                                        <span>
                                            Percentage
                                        </span>
                                    </label>

                                </div>

                            </div>

                            <div className="expense-form-group full-width">

                                <label>
                                    Split between
                                </label>

                                <div className="participants-grid">

                                    {members.map(
                                        (member) => {
                                            const userId =
                                                member.user._id;

                                            const selected =
                                                selectedParticipants.includes(
                                                    userId
                                                );

                                            return (
                                                <div
                                                    className={
                                                        selected
                                                            ? "participant-option selected"
                                                            : "participant-option"
                                                    }
                                                    key={
                                                        userId
                                                    }
                                                >

                                                    <label>

                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                selected
                                                            }
                                                            onChange={() =>
                                                                handleParticipantChange(
                                                                    userId
                                                                )
                                                            }
                                                        />

                                                        <span>
                                                            {
                                                                member
                                                                    .user
                                                                    .name
                                                            }
                                                        </span>

                                                    </label>

                                                    {selected &&
                                                        expenseData.splitType !==
                                                            "equal" && (
                                                            <input
                                                                className="participant-value"
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                max={
                                                                    expenseData.splitType ===
                                                                    "percentage"
                                                                        ? "100"
                                                                        : undefined
                                                                }
                                                                placeholder={
                                                                    expenseData.splitType ===
                                                                    "percentage"
                                                                        ? "%"
                                                                        : "₹"
                                                                }
                                                                value={
                                                                    participantValues[
                                                                        userId
                                                                    ] ||
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handleParticipantValueChange(
                                                                        userId,
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        )}

                                                </div>
                                            );
                                        }
                                    )}

                                </div>

                            </div>

                            <div className="expense-form-group full-width">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    placeholder="Add a note about this expense..."
                                    value={
                                        expenseData.description
                                    }
                                    onChange={
                                        handleExpenseChange
                                    }
                                />

                            </div>

                            <div className="expense-form-actions">

                                <button
                                    type="button"
                                    className="expense-cancel-button"
                                    onClick={() => {
                                        resetExpenseForm();
                                        setShowExpenseForm(
                                            false
                                        );
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="expense-save-button"
                                >
                                    Add Expense →
                                </button>

                            </div>

                        </form>

                    </section>
                )}

                {/* =========================
                    EXPENSE LIST
                ========================= */}
                <section className="expense-list-section">

                    <div className="expenses-section-heading">

                        <div>
                            <p className="expenses-section-label">
                                SPENDING
                            </p>

                            <h2>
                                Trip expenses
                            </h2>
                        </div>

                        <span className="expense-count">
                            {expenses.length}{" "}
                            {expenses.length === 1
                                ? "expense"
                                : "expenses"}
                        </span>

                    </div>

                    {expenses.length === 0 ? (
                        <div className="expenses-empty">

                            <div className="expenses-empty-icon">
                                💸
                            </div>

                            <h3>
                                No expenses yet
                            </h3>

                            <p>
                                Add your first trip expense
                                to start tracking spending.
                            </p>

                            <button
                                onClick={() =>
                                    setShowExpenseForm(
                                        true
                                    )
                                }
                            >
                                + Add First Expense
                            </button>

                        </div>
                    ) : (
                        <div className="expenses-list">

                            {expenses.map((expense) => (

                                <article
                                    className="expense-item"
                                    key={expense._id}
                                >

                                    {editingExpenseId ===
                                    expense._id ? (
                                        <form
                                            className="expense-edit-form"
                                            onSubmit={(e) => {
                                                e.preventDefault();

                                                const formData =
                                                    new FormData(
                                                        e.target
                                                    );

                                                handleEditExpense(
                                                    expense._id,
                                                    {
                                                        title:
                                                            formData.get(
                                                                "title"
                                                            ),
                                                        amount:
                                                            Number(
                                                                formData.get(
                                                                    "amount"
                                                                )
                                                            ),
                                                        category:
                                                            formData.get(
                                                                "category"
                                                            ),
                                                        description:
                                                            formData.get(
                                                                "description"
                                                            )
                                                    }
                                                );
                                            }}
                                        >

                                            <div>
                                                <label>
                                                    Title
                                                </label>

                                                <input
                                                    name="title"
                                                    defaultValue={
                                                        expense.title
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label>
                                                    Amount
                                                </label>

                                                <input
                                                    name="amount"
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    defaultValue={
                                                        expense.amount
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label>
                                                    Category
                                                </label>

                                                <select
                                                    name="category"
                                                    defaultValue={
                                                        expense.category
                                                    }
                                                >
                                                    <option value="food">
                                                        Food
                                                    </option>

                                                    <option value="hotel">
                                                        Hotel
                                                    </option>

                                                    <option value="transport">
                                                        Transport
                                                    </option>

                                                    <option value="shopping">
                                                        Shopping
                                                    </option>

                                                    <option value="activity">
                                                        Activity
                                                    </option>

                                                    <option value="other">
                                                        Other
                                                    </option>
                                                </select>
                                            </div>

                                            <div className="edit-description">
                                                <label>
                                                    Description
                                                </label>

                                                <textarea
                                                    name="description"
                                                    defaultValue={
                                                        expense.description ||
                                                        ""
                                                    }
                                                />
                                            </div>

                                            <div className="expense-edit-actions">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditingExpenseId(
                                                            null
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </button>

                                                <button type="submit">
                                                    Save Changes
                                                </button>

                                            </div>

                                        </form>
                                    ) : (
                                        <>
                                            <div
                                                className={`expense-category-icon category-${expense.category}`}
                                            >
                                                {getCategoryIcon(
                                                    expense.category
                                                )}
                                            </div>

                                            <div className="expense-item-content">

                                                <div className="expense-item-title-row">

                                                    <h3>
                                                        {
                                                            expense.title
                                                        }
                                                    </h3>

                                                    <strong>
                                                        ₹
                                                        {
                                                            expense.amount
                                                        }
                                                    </strong>

                                                </div>

                                                <div className="expense-meta">

                                                    <span>
                                                        {expense.category}
                                                    </span>

                                                    <span>
                                                        Paid by{" "}
                                                        <strong>
                                                            {
                                                                expense
                                                                    .paidBy
                                                                    ?.name
                                                            }
                                                        </strong>
                                                    </span>

                                                    <span>
                                                        Split:{" "}
                                                        {
                                                            expense.splitType
                                                        }
                                                    </span>

                                                </div>

                                                {expense.description && (
                                                    <p className="expense-description">
                                                        {
                                                            expense.description
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                            <div className="expense-item-actions">

                                                <button
                                                    onClick={() =>
                                                        setEditingExpenseId(
                                                            expense._id
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteExpense(
                                                            expense._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        </>
                                    )}

                                </article>

                            ))}

                        </div>
                    )}

                </section>

                {/* =========================
                    BALANCES
                ========================= */}
                {expenseSummary && (
                    <section className="balances-section">

                        <div className="expenses-section-heading">

                            <div>
                                <p className="expenses-section-label">
                                    GROUP BALANCES
                                </p>

                                <h2>
                                    Who owes what?
                                </h2>
                            </div>

                        </div>

                        <div className="balances-grid">

                            {expenseSummary.balances?.map(
                                (item) => (

                                    <div
                                        className="balance-card"
                                        key={item.user._id}
                                    >

                                        <div className="balance-avatar">
                                            {item.user.name
                                                ?.charAt(
                                                    0
                                                )
                                                .toUpperCase()}
                                        </div>

                                        <div className="balance-info">

                                            <h3>
                                                {
                                                    item
                                                        .user
                                                        .name
                                                }
                                            </h3>

                                            <p>
                                                {item.status ===
                                                    "receive" &&
                                                    "Should receive"}

                                                {item.status ===
                                                    "owe" &&
                                                    "Owes"}

                                                {item.status ===
                                                    "settled" &&
                                                    "Settled"}
                                            </p>

                                        </div>

                                        <strong
                                            className={`balance-amount balance-${item.status}`}
                                        >
                                            ₹
                                            {Math.abs(
                                                item.balance
                                            )}
                                        </strong>

                                    </div>

                                )
                            )}

                        </div>

                    </section>
                )}

                {/* =========================
                    MEMBER PAYMENTS
                ========================= */}
                {expenseSummary && (
                    <section className="payments-section">

                        <div className="expenses-section-heading">

                            <div>
                                <p className="expenses-section-label">
                                    CONTRIBUTIONS
                                </p>

                                <h2>
                                    Member payments
                                </h2>
                            </div>

                        </div>

                        <div className="payments-list">

                            {expenseSummary.memberPayments?.map(
                                (item) => (

                                    <div
                                        className="payment-row"
                                        key={item.user._id}
                                    >

                                        <div className="payment-person">

                                            <div className="payment-avatar">
                                                {item.user.name
                                                    ?.charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>

                                            <strong>
                                                {
                                                    item
                                                        .user
                                                        .name
                                                }
                                            </strong>

                                        </div>

                                        <span>
                                            Paid
                                        </span>

                                        <strong>
                                            ₹{item.paid}
                                        </strong>

                                    </div>

                                )
                            )}

                        </div>

                    </section>
                )}

                {/* =========================
                    SETTLEMENTS
                ========================= */}
                <section className="settlements-section">

                    <div className="expenses-section-heading">

                        <div>
                            <p className="expenses-section-label">
                                SETTLE UP
                            </p>

                            <h2>
                                Settlements
                            </h2>

                            <p>
                                Record payments between
                                group members.
                            </p>
                        </div>

                        <button
                            className="settlement-button"
                            onClick={() =>
                                setShowSettlementForm(
                                    !showSettlementForm
                                )
                            }
                        >
                            {showSettlementForm
                                ? "Cancel"
                                : "+ Settlement"}
                        </button>

                    </div>

                    {showSettlementForm && (
                        <div className="settlement-form-card">

                            <div className="settlement-form-group">
                                <label>
                                    Pay from
                                </label>

                                <select
                                    value={
                                        settlementData.from
                                    }
                                    onChange={(e) =>
                                        setSettlementData({
                                            ...settlementData,
                                            from: e.target.value
                                        })
                                    }
                                >
                                    <option value="">
                                        Select member
                                    </option>

                                    {members.map(
                                        (member) => (
                                            <option
                                                key={
                                                    member.user
                                                        ._id
                                                }
                                                value={
                                                    member.user
                                                        ._id
                                                }
                                            >
                                                {
                                                    member.user
                                                        .name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="settlement-arrow">
                                →
                            </div>

                            <div className="settlement-form-group">
                                <label>
                                    Pay to
                                </label>

                                <select
                                    value={
                                        settlementData.to
                                    }
                                    onChange={(e) =>
                                        setSettlementData({
                                            ...settlementData,
                                            to: e.target.value
                                        })
                                    }
                                >
                                    <option value="">
                                        Select member
                                    </option>

                                    {members.map(
                                        (member) => (
                                            <option
                                                key={
                                                    member.user
                                                        ._id
                                                }
                                                value={
                                                    member.user
                                                        ._id
                                                }
                                            >
                                                {
                                                    member.user
                                                        .name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="settlement-form-group">
                                <label>
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="₹ 0.00"
                                    value={
                                        settlementData.amount
                                    }
                                    onChange={(e) =>
                                        setSettlementData({
                                            ...settlementData,
                                            amount: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <button
                                className="settlement-create-button"
                                onClick={
                                    handleCreateSettlement
                                }
                            >
                                Create Settlement
                            </button>

                        </div>
                    )}

                    {settlements.length === 0 ? (
                        <div className="settlements-empty">
                            <span>🤝</span>

                            <div>
                                <h3>
                                    No settlements yet
                                </h3>

                                <p>
                                    When someone pays another
                                    member back, record it here.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="settlements-list">

                            {settlements.map(
                                (settlement) => (

                                    <div
                                        className="settlement-card"
                                        key={
                                            settlement._id
                                        }
                                    >

                                        <div className="settlement-person">

                                            <div className="settlement-avatar">
                                                {settlement
                                                    .from
                                                    ?.name
                                                    ?.charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>

                                            <strong>
                                                {
                                                    settlement
                                                        .from
                                                        ?.name
                                                }
                                            </strong>

                                        </div>

                                        <div className="settlement-middle">

                                            <span>
                                                pays
                                            </span>

                                            <strong>
                                                ₹
                                                {
                                                    settlement.amount
                                                }
                                            </strong>

                                            <span>
                                                to
                                            </span>

                                        </div>

                                        <div className="settlement-person">

                                            <div className="settlement-avatar">
                                                {settlement
                                                    .to
                                                    ?.name
                                                    ?.charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>

                                            <strong>
                                                {
                                                    settlement
                                                        .to
                                                        ?.name
                                                }
                                            </strong>

                                        </div>

                                        <div className="settlement-status">

                                            <span
                                                className={`status-badge status-${settlement.status}`}
                                            >
                                                {
                                                    settlement.status
                                                }
                                            </span>

                                            {settlement.status ===
                                                "pending" && (
                                                <button
                                                    onClick={() =>
                                                        handleMarkSettlementPaid(
                                                            settlement._id
                                                        )
                                                    }
                                                >
                                                    Mark Paid
                                                </button>
                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>
                    )}

                </section>

            </main>

            <footer className="expenses-footer">
                <span>TripMate</span>
                <p>
                    Plan less. Travel more.
                </p>
            </footer>

        </div>
    );
}

export default Expenses;