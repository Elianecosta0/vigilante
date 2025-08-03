// firebaseHooks.js
import { collection, addDoc, updateDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { useState, useEffect } from 'react';

export async function createGroup(groupName) { /* ... */ }
export async function joinGroup(group) { /* ... */ }
export function useJoinedGroups() { /* ... */ }
export function useGroupMessages(groupId) { /* ... */ }
export async function sendMessage(groupId, text) { /* ... */ }
