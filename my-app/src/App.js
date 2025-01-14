import { useEffect, useState } from 'react';
import {
	Routes,
	Route,
	NavLink,
	Outlet,
	useParams,
	Link,
	useNavigate
} from 'react-router-dom';
import './App.css';
import './icon-search.svg';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [refreshTodos, setRefreshTodos] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		fetch('http://localhost:3003/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
			});
	}, [refreshTodos]);

	//Добавить дело
	const requestAddWork = () => (_) => {
		setIsCreating(true);

		fetch('http://localhost:3003/todos/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				userId: 1,
				title: 'adipisci non ad dicta qui amet quaerat doloribus ea',
				completed: 'completed',
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Добавлено дело, ответ сервера:', response);
				setRefreshTodos(!refreshTodos);
			})
			.finally(() => setIsCreating(false));
	};

	//Сортировка дел
	const funSort = () => {
		if (!isLoading) {
			const dataSort = [...todos].sort((a, b) => a.title.localeCompare(b.title));
			setTodos(dataSort);
			setIsLoading(true);
		} else {
			const dataSort = [...todos].sort((a, b) => b.title.localeCompare(a.title));
			setTodos(dataSort);
			setIsLoading(false);
		}
	};

	//Кн. Назад
	const back = () => {
		navigate(-1);
	};



	const fetchTodo = (id) => new Promise ((resolve) => {
		resolve(todos[id]);
	});

	const TodoNotFound = () => <div>Дело не существует</div>;

	const Todo = () => {
		const [dataTodo, setDataTodo] = useState(null);
		const params = useParams();

		useEffect(() => {
			fetchTodo(params.id).then((loadedTodo) => {
				setDataTodo(loadedTodo);
			});
		}, [params.id]);

		if(!dataTodo) {
			return <TodoNotFound/>;
		}

		const { id, title } = dataTodo;

		return (
			<>
				<div>Идентификатор дела: {id}</div>
				<div>Дело: {title}</div>
			</>
		);
	};

	const MainPage = () => (
		<div>
			<h3>Дела:</h3>
			<ul>
				{todos.map(({ id, title }) => (
					<li key={id}>
						<NavLink to={`todo/${id - 1}`}>
							{id} - {title}
						</NavLink>
					</li>
				))}
			</ul>

			<div>
				<button
					className="button"
					disabled={isCreating}
					onClick={requestAddWork()}
				>
					Добавить дело
				</button>
				<button className="btn" onClick={funSort}>
					Сортировка
				</button>
				<button className="btn" onClick={back}>
					Назад
				</button>
			</div>
			<Outlet />
		</div>
	);

	const Meet = () => {
		return (
			<>
				Контент контактов
				<div>
					<button className="btn" onClick={back}>
						Назад
					</button>
				</div>
			</>
		);
	};
	const Contacts = () => <div><Outlet /></div>;

	const Error = () => {
		return (
			<>
				Страница не существует
			</>
		);
	};
	const NotFound = () => <div><Outlet /></div>;


	return (
		<div className="App">
			<ul>
				<li>
					<Link to="/main">Главная</Link>
				</li>
				<li>
					<Link to="/contacts">Контакты</Link>
				</li>
			</ul>

			<Routes>
				<Route path="/main" element={<MainPage />}>
					<Route path="todo/:id" element={<Todo />} />
				</Route>

				<Route path="/" element={<NotFound />}>
					<Route path="*" element={<Error />} />
				</Route>

				<Route path="/" element={<Contacts />}>
					<Route path="/contacts" element={<Meet />} />
				</Route>
			</Routes>
		</div>
	);
};
