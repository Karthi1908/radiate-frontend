import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { connectWallet } from "../actions";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import "../css/dashboard.css";

import Illus from "../assets/illus.png";
import Clock from "../assets/clock.png";
import Tezos from "../assets/tezos.png";

export const Dashboard = ({ streams }) => {
	const selector = useSelector((state) => {
		return state.walletConfig.user;
	});
	const dispatch = useDispatch();

	return (
		<div className="container">
			{selector.userAddress === "" ? (
				<div
					className="col main-section container-content"
					align="center"
				>
					{/* <div className="img-div"><img src={Illus} className="dash-img" /></div> */}
					<div className="dash-main">
						<p className="sign-in-text">
							Sign in with your tezos account to view incoming
							streams
						</p>
						<button
							type="button"
							onClick={(e) => {
								dispatch(connectWallet());
							}}
							className="btn sign-in-btn"
						>
							Connect Wallet
						</button>
					</div>
				</div>
			) : (
				<div>
					{streams === null ? (
						<div className="col container-content" align="center">
							<div style={{ padding: "10px" }}>
								<div
									style={{
										width: "300px",
										marginRight: "auto",
									}}
								>
									<Skeleton />
								</div>
								<Skeleton count={3} />
								<div
									style={{
										width: "500px",
										marginRight: "auto",
									}}
								>
									<Skeleton />
								</div>
							</div>
						</div>
					) : (
						<div>
							{streams.length === 0 ? (
								<div
									className="col main-section container-content"
									align="center"
								>
									<div className="dash-main">
										<p className="sign-in-text">
											No, streams yet!
										</p>
									</div>
								</div>
							) : (
								<div className="row container-content">
									<div className="col-12 table-section">
										<div className="table-responsive">
											<table className="table table-light table-borderless">
												<thead className="top-head">
													<tr className="dash-head">
														<th
															scope="col"
															className="dash-table-header"
														>
															STATUS
														</th>
														<th
															scope="col"
															className="dash-table-header"
														>
															SENDER
														</th>
														<th
															scope="col"
															className="dash-table-header"
														>
															BALANCE
														</th>
														<th
															scope="col"
															className="dash-table-header"
														>
															START TIME
														</th>
														<th
															scope="col"
															className="dash-table-header"
														>
															STOP TIME
														</th>
													</tr>
												</thead>
												<tbody className="dash-body">
													{streams.map(
														(stream, i) => {
															return (
																<tr className="dash-row">
																	{stream.isActive ? (
																		<td>
																			<Link
																				to={
																					"/stream/" +
																					stream.streamId
																				}
																				className="streaming"
																			>
																				Streaming
																			</Link>
																		</td>
																	) : (
																		<td>
																			<Link
																				to={
																					"/stream/" +
																					stream.streamId
																				}
																				className="cancelled"
																			>
																				Cancelled
																			</Link>
																		</td>
																	)}
																	<td className="sender dash-table-body">
																		<a
																			target="_blank"
																			href={
																				"https://granadanet.tzkt.io/" +
																				stream.sender +
																				"/operations"
																			}
																		>
																			{
																				stream.sender
																			}
																		</a>
																	</td>
																	<td className="dash-table-body">
																		<img
																			src={
																				Tezos
																			}
																			className="tezos-icon"
																		/>
																		{stream.remainingBalance /
																			1000000}
																	</td>
																	<td className="dash-table-body">
																		{new Date(
																			Date.parse(
																				stream.startTime
																			)
																		).toDateString() +
																			" " +
																			new Date(
																				Date.parse(
																					stream.startTime
																				)
																			)
																				.toTimeString()
																				.split(
																					" GMT"
																				)[0]}
																	</td>
																	<td className="dash-table-body">
																		{new Date(
																			Date.parse(
																				stream.stopTime
																			)
																		).toDateString() +
																			" " +
																			new Date(
																				Date.parse(
																					stream.stopTime
																				)
																			)
																				.toTimeString()
																				.split(
																					" GMT"
																				)[0]}
																	</td>
																</tr>
															);
														}
													)}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

// receiving streams
